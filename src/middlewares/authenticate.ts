import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config"
import { Response, NextFunction } from "express"
import asyncErrorHandler from "../utils/asyncErrorHandler"
import createHttpError from "http-errors"
import { PrismaClient } from "@prisma/client"
import { IRequest } from "../validators/userProfile"

const prisma = new PrismaClient()

const authenticate = asyncErrorHandler(async (req: IRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(createHttpError(401, "Unauthorized"))
  }

  const token = authorization.split(" ")[1]
  const decoded = jwt.verify(token, JWT_SECRET!) as { userId?: number }

  const user = await prisma.user.findFirst({
    where: { id: decoded.userId },
  })

  if (user) {
    req.userId = decoded.userId
    return next()
  } else {
    return next(createHttpError(401, "Unauthorized"))
  }
})

export default authenticate
