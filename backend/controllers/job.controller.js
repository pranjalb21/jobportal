import mongoose from "mongoose";
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

export const getAllJobs = asyncHandler(async (req, res, next) => {
    const { city, niche, keyword } = req.query;
    let query = {};
    if (city) {
        query.location = city;
    }
    if (niche) {
        query.niche = niche;
    }
    if (keyword) {
        query.$or = [
            { title: { $regex: keyword, $options: "i" } },
            { companyName: { $regex: keyword, $options: "i" } },
            { introduction: { $regex: keyword, $options: "i" } },
        ];
    }
    const jobs = await Job.find(query);
    res.status(200).json({
        success: true,
        jobs,
        message: `Jobs fetched successfully.`,
        count: jobs.length,
    });
});

export const getMyJobs = asyncHandler(async (req, res, next) => {
    const jobs = await Job.find({ postedBy: req.user._id });
    res.status(200).json({
        success: true,
        jobs,
        message: `Jobs fetched successfully.`,
    });
});

export const getJobById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return next(new ErrorHandler(`Invalid job.`, 400));
    }
    const job = await Job.findById(id);
    if (!job) {
        return next(new ErrorHandler(`Invalid job.`, 400));
    }
    res.status(200).json({
        success: true,
        job,
        message: `Job fetched successfully.`,
    });
});

export const deleteJobById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return next(new ErrorHandler(`Invalid job.`, 400));
    }
    const job = await Job.findById(id);
    if (!job) {
        return next(new ErrorHandler(`Invalid job.`, 400));
    }
    if (!job.postedBy.equals(req.user._id)) {
        return next(new ErrorHandler(`Unauthorized action`, 400));
    }
    const deletedJob = await Job.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        job: deletedJob,
        message: `Job deleted successfully.`,
    });
});
