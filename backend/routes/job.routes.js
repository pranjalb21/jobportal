import { Router } from "express";
import {
    deleteJobById,
    getAllJobs,
    getJobById,
    getMyJobs,
    postJob,
} from "../controllers/job.controller.js";
import { isAuthorized, verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router
    .post("/post", verifyJwt, isAuthorized("employer"), postJob)
    .get("/all", getAllJobs)
    .get("/myjobs", verifyJwt, isAuthorized("employer"), getMyJobs)
    .get("/:id", verifyJwt, getJobById)
    .delete(
        "/:id",
        verifyJwt,
        isAuthorized("employer", getJobById),
        deleteJobById
    );

export default router;
