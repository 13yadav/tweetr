import bcrypt from "bcrypt"

const saltRounds = 10

export const encryptPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, saltRounds)
  } catch (error) {
    let message = "Encryption Failed!"
    if (error instanceof Error) {
      message = error.message
    }
    throw new Error(message)
  }
}

export const verifyPassword = async (password: string, hashedPassword: string) => {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    let message = "Password comparison error"
    if (error instanceof Error) {
      message = error.message
    }
    throw new Error(message)
  }
}
