import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import User from "../models/user.model.js";
import {
    deleteFromCloudinary,
    uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { sendToken } from "../utils/jwt.js";

export const registerUser = asyncHandler(async (req, res, next) => {
    try {
        const {
            name,
            email,
            phone,
            address,
            password,
            role,
            firstNiche,
            secondNiche,
            thirdNiche,
            coverletter,
        } = req.body;
        if (!name || !email || !phone || !address || !password || !role) {
            return next(new ErrorHandler(`All fields are required.`, 400));
        }
        if (
            role.toLowerCase() === "applicant" &&
            (!firstNiche || !secondNiche || !thirdNiche)
        ) {
            return next(
                new ErrorHandler(`Please choose your preferred job role.`, 400)
            );
        }
        if (password.length < 4) {
            return next(
                new ErrorHandler(`Password must be atleast 4 characters.`, 400)
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErrorHandler(`User already exists.`, 400));
        }
        const newUser = {
            name,
            email,
            phone,
            address,
            password,
            role: role.toLowerCase(),
            niches: {
                firstNiche,
                secondNiche,
                thirdNiche,
            },
            coverletter,
        };
        if (req.files && req.files.resume) {
            const { resume } = req.files;
            if (resume) {
                try {
                    const upload_result = await uploadOnCloudinary(
                        resume.tempFilePath
                    );
                    if (!upload_result || upload_result.error) {
                        return next(
                            new ErrorHandler(
                                `Failed to upload resume on cloud.`,
                                500
                            )
                        );
                    }
                    newUser.resume = {
                        public_id: upload_result.public_id,
                        url: upload_result.secure_url,
                    };
                } catch (error) {
                    return next(
                        new ErrorHandler(
                            `Failed to upload resume on cloud.`,
                            500
                        )
                    );
                }
            }
        }

        let user = await User.create(newUser);
        sendToken(user, 201, res, `User registered successfully.`);

        // res.status(201).json({
        //     success: true,
        //     message: `User registered successfully.`,
        //     user,
        // });
    } catch (err) {
        next(err);
    }
});

export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return next(new ErrorHandler(`All fields are required.`, 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler(`Invalid credentials.`, 400));
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        return next(new ErrorHandler(`Invalid credentials.`, 400));
    }

    if (user.role !== role) {
        return next(new ErrorHandler(`Invalid credentials.`, 400));
    }

    delete user.password;
    sendToken(user, 200, res, `Login successful.`);
});

export const logoutUser = asyncHandler(async (req, res, next) => {
    const options = {
        httpOnly: true,
        secure: true,
    };
    res.status(200)
        .clearCookie("token", options)
        .json({ success: true, message: `Logged out successfully.` });
});

export const getUserDetails = asyncHandler(async (req, res, next) => {
    return res.status(200).json({
        success: true,
        user: req.user,
        message: `User details fetched successfully.`,
    });
});

export const updateUserData = asyncHandler(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        password: req.body.password,
        niches: {
            firstNiche: req.body.firstNiche,
            secondNiche: req.body.secondNiche,
            thirdNiche: req.body.thirdNiche,
        },
        coverletter: req.body.coverletter,
    };

    const { firstNiche, secondNiche, thirdNiche } = newUserData.niches;
    if (
        req.user.role === "applicant" &&
        (!firstNiche || !secondNiche || !thirdNiche)
    ) {
        return next(
            new ErrorHandler(`Please select your preferred niches.`, 400)
        );
    }

    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    }).select("-password");
    req.user = user;
    res.status(200).json({
        success: true,
        user,
        message: `Account updated successfully.`,
    });
});

export const updateUserResume = asyncHandler(async (req, res, next) => {
    if (req.files && req.files.resume) {
        const { resume } = req.files;

        const upload_result = await uploadOnCloudinary(resume.tempFilePath);

        if (!upload_result || upload_result.error) {
            return next(new ErrorHandler(`Upload failed.`, 400));
        }
        if (req.user.resume.public_id) {
            await deleteFromCloudinary(req.user.resume.public_id);
        }
        const newUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                resume: {
                    public_id: upload_result.public_id,
                    url: upload_result.secure_url,
                },
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        ).select("-password");

        res.status(200).json({
            success: true,
            user: newUser,
            message: `Resume has been updated.`,
        });
    } else {
        return next(
            new ErrorHandler(`Please provide a resume for upload.`, 400)
        );
    }
});

export const updateUserPassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, password, confirmPassword } = req.body;
    if (!oldPassword || !password || !confirmPassword) {
        return next(new ErrorHandler(`All fields are required.`, 400));
    }
    if (password.length < 4) {
        return next(
            new ErrorHandler(`Password must be atleast 4 characters.`, 400)
        );
    }
    if (password !== confirmPassword) {
        return next(
            new ErrorHandler(`Password and confirm password must be same.`, 400)
        );
    }
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ErrorHandler(`Please login.`, 400));
    }
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
        return next(new ErrorHandler(`Invalid credentials.`, 400));
    }

    user.password = password
    await user.save()
    sendToken(user,200,res,`Password updated successfully.`)
});
