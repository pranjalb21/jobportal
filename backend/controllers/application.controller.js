import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.middleware.js";
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
        id: req.user._id,
        name,
        email,
        phone,
        address,
        coverLetter,
        role: "applicant",
    };
    const job = await Job.findById(id);
    if (!job) {
        return next(new ErrorHandler(`Job not found.`, 400));
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
    }
});

export const employerGetAllApplication = asyncHandler(
    async (req, res, next) => {}
);
export const applicantGetAllApplication = asyncHandler(
    async (req, res, next) => {}
);
export const deleteApplication = asyncHandler(async (req, res, next) => {});
export const applyApplication = asyncHandler(async (req, res, next) => {});
