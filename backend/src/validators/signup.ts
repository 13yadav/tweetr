import { Request, Response, NextFunction } from "express"
import asyncErrorHandler from "../utils/asyncErrorHandler"
import zod from "zod"

const SignUpSchema = zod.object({
  firstName: zod.string().min(2).max(255).trim(),
  lastName: zod.string().min(1).max(255).trim(),
  email: zod.string().email().trim().toLowerCase(),
  password: zod.string().min(6).max(20),
})

export type SignUpBody = zod.infer<typeof SignUpSchema>

export const signupValidator = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validator = SignUpSchema.safeParse(req.body)
    if (!validator.success) {
      return res.status(400).json(validator.error.flatten())
    }

    next()
  }
)
