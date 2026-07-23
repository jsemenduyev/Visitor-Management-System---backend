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

/** Normalize expiry: bare numbers are treated as seconds; prefer values like "7d", "12h". */
const resolveJwtExpiry = (): string | number => {
  const raw = (process.env.JWT_EXPIRY || "7d").trim();
  if (!raw) return "7d";
  // Reject tiny bare numbers that ms() would treat as milliseconds (e.g. "2" → 2ms)
  if (/^\d+$/.test(raw)) {
    const seconds = Number(raw);
    return seconds < 60 ? "7d" : seconds;
  }
  return raw;
};

const JWT_EXPIRY = resolveJwtExpiry();

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
    { expiresIn: JWT_EXPIRY as jwt.SignOptions["expiresIn"] }
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
