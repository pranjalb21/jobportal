import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbconnect from "./db.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";

config({ path: "./config/config.env" });
const app = express();
app.use(
    cors({
        origin: [process.env.FRONTEND_URI],
        methods: ["*"],
        credentials: true,
    })
);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    api_key: process.env.CLOUDINARY_API_KEY,
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

import userRouter from "./routes/user.routes.js";
import jobRouter from "./routes/job.routes.js";
import applicationRouter from "./routes/application.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

dbconnect();
app.use(errorMiddleware);

export default app;
