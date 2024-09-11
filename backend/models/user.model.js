import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minLength: [3, "Name must be atleast 3 characters."],
            maxLength: [30, "Name must be maximum 30 characters."],
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
        niches: {
            firstNiche: String,
            secondNiche: String,
            thirdNiche: String,
        },
        password: {
            type: String,
            minLength: [4, "Password must be atleast 4 characters."],
            maxLength: [10, "Password must be atleast 10 characters."],
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
            required: true,
            enum: ["applicant", "employer"],
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.getJwtToken = async function () {
    return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(String(password), this.password);
};
const User = mongoose.model("User", userSchema);
export default User;
