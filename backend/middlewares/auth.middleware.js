import User from "../models/user.model.js";
import { asyncHandler } from "./asyncHandler.js";
import ErrorHandler from "./error.middleware.js";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler(`User not logged in.`, 400));
    }
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.id).select("-password");
    if (!user) {
        return next(new ErrorHandler(`Invalid token.`, 400));
    }
    req.user = user
    next();
});
