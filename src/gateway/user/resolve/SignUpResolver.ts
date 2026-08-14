import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { UserModel } from "../../../../database/models/user";
import {
  sendVerificationLinkToOwner,
  sendVerificationLinkToUser,
} from "../../../../utils/email";
import { MutationSignupArgs } from "../../../generated/graphql";
import { CompanyModel } from "../../../../database/models/company";
import OfficeLocationModel from "../../../../database/models/officelocations";
import { AgreementModel } from "../../../../database/models/agreements";
import { agreementData } from "../../../../utils/agrrementData";


const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone: string) => /^\+\d{10,15}$/.test(phone);

export default async (_, args: MutationSignupArgs) => {
  const {
    firstName,
    lastName,
    email,
    phoneNo,
    password,
    address,
    companyName,
  } = args.input;

  // 1. Basic validation
  if (!isValidEmail(email)) {
    return {
      error: {
        message: "Invalid email format",
        code: "INVALID_EMAIL",
      },
    };
  }

  if (phoneNo && !isValidPhone(phoneNo)) {
    return {
      error: {
        message: "Invalid phone number",
        code: "INVALID_PHONE",
      },
    };
  }

  // 2. Check if user with the same phone number already exists
  const existingPhoneUser = await UserModel.findOne({ phoneNo });
  if (existingPhoneUser) {
    return {
      error: {
        message: "User with this phone number already exists",
        code: "USER_PHONE_EXIST",
      },
    };
  }

  // 3. Check if user with the same email already exists
  const existingEmailUser = await UserModel.findOne({ email });
  if (existingEmailUser) {
    return {
      error: {
        message: "User with this email already exists",
        code: "USER_EMAIL_EXIST",
      },
    };
  }

  const userId = new mongoose.Types.ObjectId();

  const location = await OfficeLocationModel.create({
    name: "Head Office",
    createdBy: userId,
  });

  const createCompany = await CompanyModel.create({
    name: companyName,
    address: address,
    location: location._id,
  });

  await OfficeLocationModel.findByIdAndUpdate(
    { _id: location._id },
    { company: createCompany._id },
  );

  const hashedPassword = await bcrypt.hash(password, 10);

  const savedUser = await UserModel.create({
    _id: userId,
    createdBy: userId,
    firstName,
    lastName,
    email,
    phoneNo,
    password: hashedPassword,
    address,
    company: createCompany._id,
    role: "admin",
    location: location._id,
  });

  const agreement = await AgreementModel.create({
    company: createCompany._id,
    createdBy: userId,
    title: agreementData.title,
    content: agreementData.content,
  });

  if (agreement) {
    await CompanyModel.findByIdAndUpdate(createCompany._id, {
      selectedAgreement: {
        agreement: agreement._id,
        signature: true,
      },
    });
  }

  const fullName = `${savedUser.firstName ?? ""} ${savedUser.lastName ?? ""}`.trim();

  try {
    await sendVerificationLinkToOwner(
      savedUser._id.toString(),
      fullName,
      savedUser.email,
      companyName,
    );
    await sendVerificationLinkToUser(
      savedUser._id.toString(),
      fullName,
      savedUser.email,
    );
  } catch (emailError) {
    console.error("Failed to send signup verification emails:", emailError);
    return {
      user: savedUser,
      error: {
        message:
          "Account created but verification email could not be sent. Please contact support.",
        code: "EMAIL_SEND_FAILED",
      },
    };
  }

  return {
    user: savedUser,
    error: null,
  };
};
