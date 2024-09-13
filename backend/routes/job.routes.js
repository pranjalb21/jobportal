import { Router } from "express";
import { postJob } from "../controllers/job.controller.js";
import { isAuthorized, verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/post", verifyJwt, isAuthorized("employer"), postJob);

export default router;
