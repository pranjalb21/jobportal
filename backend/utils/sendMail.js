import { text } from "express";
import nodeMailer from "nodemailer";

export const sendMail = async ({ email, subject, message }) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    const options = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        text: message,
    };
    console.log(options);
    await transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info.response);
        }
    });
};
