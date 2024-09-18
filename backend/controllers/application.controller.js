import mongoose from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const postApplication = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, email, phone, address, coverLetter } = req.body;
    if (!name || !email || !phone || !address || !coverLetter) {
        return next(
            new ErrorHandler(`Please provide all required fields.`, 400)
        );
    }
    let applicantInfo = {
        applicantId: req.user._id,
        name,
        email,
        phone,
        address,
        coverLetter,
        role: "applicant",
    };
    if (!mongoose.isValidObjectId(id)) {
        return next(new ErrorHandler(`Job not found.`, 400));
    }

    const job = await Job.findById(id);
    if (!job) {
        return next(new ErrorHandler(`Job not found.`, 400));
    }

    const isAlreadyApplied = await Application.findOne({
        "jobInfo.jobId": id,
        "applicantInfo.applicantId": req.user._id,
    });

    if (isAlreadyApplied) {
        return next(new ErrorHandler(`Already applied.`, 400));
    }
    if (req.files && req.files.resume) {
        const uploadResult = await uploadOnCloudinary(
            req.files.resume.tempFilePath
        );
        if (!uploadResult) {
            return next(new ErrorHandler(`Resume upload failed.`, 400));
        } else {
            applicantInfo.resume = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
            };
        }
    } else {
        if (req.user && !req.user.resume.url) {
            return next(
                new ErrorHandler(`Please upload your resume to continue`, 400)
            );
        } else {
            applicantInfo.resume = {
                public_id: req.user.resume.public_id,
                url: req.user.resume.secure_url,
            };
        }
    }
    const employerInfo = {
        employerId: job.postedBy,
        role: "employer",
    };
    const jobInfo = {
        jobId: job._id,
        jobTitle: job.title,
    };

    const application = await Application.create({
        applicantInfo,
        employerInfo,
        jobInfo,
    });

    res.status(201).json({
        success: true,
        application,
        message: `Application successfull.`,
    });
});

export const employerGetAllApplication = asyncHandler(
    async (req, res, next) => {
        const applications = await Application.find({
            "employerInfo.employerId": req.user._id,
            "deletedBy.employer": false,
        });
        res.status(200).json({
            success: true,
            applications,
            message: `Applications fetched successfully.`,
        });
    }
);
export const applicantGetAllApplication = asyncHandler(
    async (req, res, next) => {
        const applications = await Application.find({
            "applicantInfo.applicantId": req.user._id,
            "deletedBy.applicant": false,
        });
        res.status(200).json({
            success: true,
            applications,
            message: `Applications fetched successfully.`,
        });
    }
);
export const deleteApplication = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if(!mongoose.isValidObjectId(id)){
        return next(new ErrorHandler(`Invalid application.`, 400));
    }
    const application = await Application.findById(id);
    if (!application) {
        return next(new ErrorHandler(`Invalid application.`, 400));
    }
    const { role } = req.user;
    switch (role) {
        case "employer":
            if (req.user._id.equals(application.employerInfo.employerId)) {
                application.deletedBy.employer = true;
                await application.save();
            }else{
                return next(new ErrorHandler(`You are not the owner of this application.`, 400));
            }
            break;
        case "applicant":
            if (req.user._id.equals(application.applicantInfo.applicantId)) {
                application.deletedBy.applicant = true;
                await application.save();
            }else{
                return next(new ErrorHandler(`You are not the owner of this application.`, 400));
            }
            break;
        default:
            return next(new ErrorHandler(`Invalid role`, 400));
            break;
    }
    if (
        application.deletedBy.applicant === true &&
        application.deletedBy.employer === true
    ) {
        await application.deleteOne()
        res.status(200).json({
            success: true,
            message: `Application deleted.`,
        });
    }
    res.status(200).json({
        success: true,
        message: `Application deleted.`,
    });
});
export const applyApplication = asyncHandler(async (req, res, next) => {});
