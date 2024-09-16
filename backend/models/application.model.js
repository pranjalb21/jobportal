import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
    applicantInfo: {
        applicantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            validate: [validator.isEmail, "Please provide a valid email."],
        },
        phone: {
            type: Number,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        resume: {
            public_id: String,
            url: String,
        },
        coverLetter: {
            type: String,
        },
        role: {
            type: String,
            enum: ["applicant"],
        },
    },
    employerInfo: {
        employerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["employer"],
            required: true,
        },
    },
    jobInfo: {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        jobTitle: {
            type: String,
            required: true,
        },
    },
    deletedBy: {
        applicant: {
            type: Boolean,
            default: false,
        },
        employer: {
            type: Boolean,
            default: false,
        },
    },
});

export const Applicant = mongoose.model("Applicant", applicationSchema);
