import jwt from "jsonwebtoken";
import { Request } from "express";
import { UserModel } from "../../database/models/user";

type JwtUserPayload = {
  _id: string;
  name: string;
  email: string;
  role: string;
  company: string;
};

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

export const signToken = (user: JwtUserPayload): string => {
  return jwt.sign(
    {
      user: {
        _id: user._id,
        userName: user.name,
        email: user.email,
        company: user.company,
      },
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

type DecodedToken = {
  user: {
    _id: string;
    userName: string;
    email: string;
  };
  iat?: number;
  exp?: number;
};

export const checkToken = async (
  token: string
): Promise<DecodedToken | undefined> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    const user = await UserModel.findById(decoded.user._id);
    if (!user) return;

    return decoded;
  } catch (err) {
    throw new Error("Invalid token");
  }
};

export const parseJwt = async (
  req: Request
): Promise<DecodedToken["user"] | undefined> => {
  const authHeader = req.headers.authorization;
  
  const token = authHeader?.replace("Bearer ", "").trim();

  if (!token) return;

  try {
    const jwtData = await checkToken(token);
    if (jwtData?.user) return jwtData.user;
    return;
  } catch (err) {
    return;
  }
};
