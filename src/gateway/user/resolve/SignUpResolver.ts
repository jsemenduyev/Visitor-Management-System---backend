import bcrypt from "bcrypt";
import { UserModel } from "../../../../database/models/user";
import { sendVerificationLinkToOwner } from "../../../../utils/email";
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

  const location = await OfficeLocationModel.create({ name: "Head Office" });

  const createCompany = await CompanyModel.create({
    name: companyName,
    address: address,
    location: location._id,
  });


  const agreement = await AgreementModel.create({
    company: createCompany._id,
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

  await OfficeLocationModel.findByIdAndUpdate(
    { _id: location._id },
    { company: createCompany._id },
  );
  // 4. Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5. Create new user
  const newUser = new UserModel({
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

  // 6. Save user to DB
  const savedUser = await newUser.save();

  await sendVerificationLinkToOwner(
    savedUser._id.toString(),
    `${savedUser.firstName ?? ""} ${savedUser.lastName ?? ""}`.trim(),
    savedUser.email,
    companyName,
  );

  return {
    user: savedUser,
    error: null,
  };
};
