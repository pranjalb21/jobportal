import cron from "node-cron";
import { Job } from "../models/job.model.js";
import User from "../models/user.model.js";
import { sendMail } from "../utils/sendMail.js";

export const newsLetterCron = () => {
    cron.schedule("*/1 * * * *", async () => {
        console.log(`Automation running`);

        const jobs = await Job.find({ updateSent: false });
        for (const job of jobs) {
            try {
                const filterdUser = await User.find({
                    role:"applicant",
                    $or: [
                        { "niches.firstNiche": job.jobNiche },
                        { "niches.secondNiche": job.jobNiche },
                        { "niches.thirdNiche": job.jobNiche },
                    ],
                });
                if (filterdUser) {
                    for (const user of filterdUser) {
                        const message = `Hi ${user.name}\nWe've found a new job opening for ${job.title} position from ${job.companyName}. We reccomend you to apply as soon as possible.\n\nBest Regards,\nJobsploreIndia Team`;
                        const subject = `Latest job alert for ${job.title}`;
                        sendMail({
                            email: user.email,
                            subject,
                            message,
                        });
                    }
                }
                job.updateSent = true;
                await job.save();
            } catch (error) {
                console.log("Error in newsletter automation.");
                return next(console.error(error || `Error in automation.`));
            }
        }
    });
};
