import { Router } from "express";
import {
    getUserDetails,
    loginUser,
    logoutUser,
    registerUser,
    updateUserData,
    updateUserPassword,
    updateUserResume,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", verifyJwt, logoutUser);
router.get("/details", verifyJwt, getUserDetails);
router.patch("/update-account", verifyJwt, updateUserData);
router.patch("/update-resume", verifyJwt, updateUserResume);
router.patch("/update-password", verifyJwt, updateUserPassword);

export default router;
