import { v2 as cloudinary } from "cloudinary";

export const uploadOnCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "Job_Portal_Resume",
        });
        return result;
    } catch (error) {
        console.log(error);
        console.log(process.env.CLOUDINARY_API_KEY);
        return false;
    }
};

export const deleteFromCloudinary = async(publicId)=>{
    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        return false;
    }
}
