import { Request, Response, NextFunction } from "express";
import { parseJwt } from "../services/authJwt";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await parseJwt(req);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    (req as any).user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};