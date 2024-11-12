import React from "react";
import { LuUserPlus } from "react-icons/lu";
import { VscTasklist } from "react-icons/vsc";
import { BiSolidLike } from "react-icons/bi";

function HowItWorks() {
    const items = [
        {
            title: "Create an Account",
            element: <LuUserPlus className="text-2xl" />,
            description: `Sign up for a free account as a job seeker or employer.
                        Set up your profile in minutes to start posting jobs or
                        applying for jobs. Customize your profile to highlight
                        your skills or requirements.`,
        },
        {
            title: "Post or Browse Jobs",
            element: <VscTasklist className="text-2xl" />,
            description: `Employers can post detailed job descriptions, and job
                        seekers can browse a comprehensive list of available
                        positions. Utilize filters to find jobs that match your
                        skills and preferences.`,
        },
        {
            title: "Hire or Get Hired",
            element: <BiSolidLike className="text-2xl" />,
            description: `Employers can shortlist candidates and extend job
                        offers. Job seekers can review job offers and accept
                        positions that align with their career goals.`,
        },
    ];
    return (
        <section className="flex flex-col w-full justify-center items-center">
            <div className="text-2xl font-bold -translate-y-10  relative group flex justify-center cursor-pointer">
                <h1 className="group-hover:-translate-y-3 duration-500  cursor-pointer bg-white self-center">
                    How does it work?
                </h1>
                <span className="-z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-6 group-hover:translate-y-0.5 duration-500">
                    &darr;
                </span>
            </div>
            <div className="w-full flex flex-col justify-center items-center gap-3 py-4 px-20">
                {items.map((item, index) => (
                    <div
                        className="bg-green-200 w-full p-4 md:h-32 hover:-translate-y-0.5 hover:bg-green-300 duration-300 rounded-lg cursor-default"
                        key={index}
                    >
                        <div className="">{item.element}</div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default HowItWorks;
