import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    jobType:{
        type:String,
        required:true,
        enum:['full-time','part-time']
    },
    location:{
        type:String,
        required:true
    },
    companyName:{
        type:String,
        required:true
    },
    introduction:{
        type:String
    },
    responsibility:{
        type:String,
        required:true
    },
})