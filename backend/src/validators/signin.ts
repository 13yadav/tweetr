import { Request, Response, NextFunction } from "express"
import asyncErrorHandler from "../utils/asyncErrorHandler"
import zod from "zod"

const SignInSchema = zod.object({
  email: zod.string().email().trim().toLowerCase(),
  password: zod.string(),
})

export type SignInBody = zod.infer<typeof SignInSchema>

export const signinValidator = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validator = SignInSchema.safeParse(req.body)
    if (!validator.success) {
      return res.status(400).json(validator.error.flatten())
    }

    next()
  }
)
