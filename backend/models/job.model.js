import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    jobType: {
        type: String,
        required: true,
        enum: ["full-time", "part-time"],
    },
    location: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    introduction: {
        type: String,
    },
    responsibilities: {
        type: String,
        required: true,
    },
    qualifications: {
        type: String,
        required: true,
    },
    benifits: {
        type: String,
    },
    salary: {
        type: String,
        required: true,
    },
    website: {
        websiteTitle: String,
        websiteUrl: String,
    },
    jobNiche: {
        type: String,
        required: true,
    },
    updateSent: {
        type: Boolean,
        default: false,
    },
    postedOn: {
        type: Date,
        default: Date.now,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    newsLetterSent: {
        type: Boolean,
        default: false,
    },
});

export const Job = mongoose.model("Job", jobSchema);
