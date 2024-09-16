import { Router } from "express";
import { isAuthorized, verifyJwt } from "../middlewares/auth.middleware.js";
import {
    applicantGetAllApplication,
    deleteApplication,
    employerGetAllApplication,
    postApplication,
} from "../controllers/application.controller.js";

const router = Router();

router
    .post("/post/:id", verifyJwt, isAuthorized("applicant"), postApplication)
    .get(
        "/employer/jobs",
        verifyJwt,
        isAuthorized("employee"),
        employerGetAllApplication
    )
    .get(
        "/applicant/jobs",
        verifyJwt,
        isAuthorized("applicant"),
        applicantGetAllApplication
    )
    .delete("/delete/:id", verifyJwt, deleteApplication);

export default router