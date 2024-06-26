import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config"
import { Prisma, PrismaClient } from "@prisma/client"
import asyncErrorHandler from "../utils/asyncErrorHandler"
import { encryptPassword, verifyPassword } from "../utils/password"
import { SignUpBody } from "../validators/signup"
import { SignInBody } from "../validators/signin"

const prisma = new PrismaClient()

export const signupController = asyncErrorHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password }: SignUpBody = req.body

  const userExists = await prisma.user.findFirst({ where: { email } })
  if (userExists) {
    return res.status(400).json({ message: "User with this email already exists" })
  }

  const hashedPassword = await encryptPassword(password)

  const user: Prisma.UserCreateInput = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: hashedPassword,
  }

  const createUser = await prisma.user.create({ data: user })

  const token = jwt.sign({ userId: createUser.id }, JWT_SECRET!)

  return res.status(201).json({
    message: "User created successfully",
    token: token,
  })
})

export const signinController = asyncErrorHandler(async (req: Request, res: Response) => {
  const { email, password }: SignInBody = req.body

  const userExists = await prisma.user.findFirst({ where: { email: email } })
  if (!userExists) {
    return res.status(404).json({ message: "Invalid email or password" })
  }

  const validPassword = await verifyPassword(password, userExists.password)
  if (!validPassword) {
    return res.status(404).json({ message: "Invalid email or password" })
  }

  const token = jwt.sign({ userId: userExists.id }, JWT_SECRET!)

  return res.json({ token: token })
})
