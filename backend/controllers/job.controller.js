import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { Job } from "../models/job.model.js";

export const postJob = asyncHandler(async (req, res, next) => {
    const {
        title,
        jobType,
        location,
        companyName,
        introduction,
        responsibilities,
        qualifications,
        benifits,
        salary,
        websiteTitle,
        websiteUrl,
        jobNiche,
        updateSent,
    } = req.body;
    if (
        !title ||
        !jobType ||
        !location ||
        !companyName ||
        !introduction ||
        !responsibilities ||
        !qualifications ||
        !salary ||
        !jobNiche
    ) {
        return next(
            new ErrorHandler("Please provide all required fields.", 400)
        );
    }
    if ((websiteTitle && !websiteUrl) || (!websiteTitle && websiteUrl))
        return next(
            new ErrorHandler(
                "Please provide both website title and link or leave it blank.",
                400
            )
        );
    const postedBy = req.user._id;
    const job = await Job.create({
        title,
        jobType: jobType.toLowerCase(),
        location,
        companyName,
        introduction,
        responsibilities,
        qualifications,
        benifits,
        salary,
        website: {
            websiteTitle,
            websiteUrl,
        },
        jobNiche,
        updateSent,
        postedBy,
    });
    res.status(201).json({
        success: true,
        message: `Job has been posted successfully.`,
        job,
    });
});
