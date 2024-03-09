import zod from "zod"
import asyncErrorHandler from "../utils/asyncErrorHandler"
import { NextFunction, Request, Response } from "express"

export const userProfileValidator = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const UserProfileSchema = zod.object({
      firstName: zod.string().optional(),
      lastName: zod.string().optional(),
      password: zod.string().optional(),
    })

    const validator = UserProfileSchema.safeParse(req.body)

    if (!validator.success) {
      return res.status(400).json(validator.error.flatten())
    }

    next()
  }
)

export interface IRequest extends Request {
  userId?: number
}
