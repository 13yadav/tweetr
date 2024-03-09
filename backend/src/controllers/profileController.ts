import { NextFunction, Response } from "express"
import asyncErrorHandler from "../utils/asyncErrorHandler"
import { PrismaClient } from "@prisma/client"
import { IRequest } from "../validators/userProfile"
import { encryptPassword } from "../utils/password"
import createHttpError from "http-errors"

const prisma = new PrismaClient()

interface ReqBody {
  firstName: string
  lastName: string
  password: string
}

export const userProfileController = asyncErrorHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const requestBody = req.body as ReqBody

      const user = await prisma.user.findFirst({
        where: { id: req.userId },
      })

      if (!user) {
        return res.status(404).json({ message: "User not found!" })
      }

      if (requestBody.firstName) {
        user.first_name = requestBody.firstName
      }
      if (requestBody.lastName) {
        user.last_name = requestBody.lastName
      }
      if (requestBody.password) {
        user.password = await encryptPassword(requestBody.password)
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { ...user },
      })

      return res.status(200).json({ message: "Account updated successfully" })
    } catch (error) {
      return next(createHttpError(500, "Something went wrong during updating profile"))
    }
  }
)
