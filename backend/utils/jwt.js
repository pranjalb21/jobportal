export const sendToken = async (user, statusCode, res, message) => {
    const token = await user.getJwtToken();
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 3600 * 1000
        ),
        httpOnly: true,
        secure:true
    };
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        message,
        token,
    });
};
