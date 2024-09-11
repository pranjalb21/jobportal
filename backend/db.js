import mongoose from "mongoose";

const dbconnect = async () => {
    await mongoose
        .connect(process.env.MONGO_URI)
        .then(() => console.log("DB connected successfully."))
        .catch((err) =>
            console.log("Something went wrong while DB connect.", err)
        );
};
export default dbconnect;
