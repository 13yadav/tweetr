import { Request, Response, NextFunction } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import zod from "zod";

export const signinValidator = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const SignInSchema = zod.object({
      email: zod.string().email().trim().toLowerCase(),
      password: zod.string(),
    });

    const validator = SignInSchema.safeParse(req.body);
    if (!validator.success) {
      return res.status(400).json(validator.error.flatten());
    }

    next();
  }
);
