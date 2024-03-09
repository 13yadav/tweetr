import { Router } from "express"
import authenticate from "../middlewares/authenticate"
import { signupValidator } from "../validators/signup"
import { signinController, signupController } from "../controllers/authController"
import { signinValidator } from "../validators/signin"
import { userProfileValidator } from "../validators/userProfile"
import { userProfileController } from "../controllers/profileController"

const router = Router()

router.post("/signup", signupValidator, signupController)

router.post("/signin", signinValidator, signinController)

router.put("/", authenticate, userProfileValidator, userProfileController)

export default router
