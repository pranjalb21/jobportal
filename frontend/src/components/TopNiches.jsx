import React from "react";

function TopNiches() {
    const services = [
        {
            id: 1,
            service: "Software Development",
            description:
                "Innovative software development services to build, maintain, and upgrade applications, ensuring they meet the highest quality standards.",
        },
        {
            id: 2,
            service: "Web Development",
            description:
                "Comprehensive web development solutions from front-end design to back-end integration, delivering responsive and user-friendly websites.",
        },
        {
            id: 3,
            service: "Data Science",
            description:
                "Advanced data science services to analyze and interpret complex data, providing actionable insights and data-driven solutions.",
        },
        {
            id: 4,
            service: "Cloud Computing",
            description:
                "Reliable cloud computing services to manage, store, and process data efficiently, offering scalable and flexible cloud solutions.",
        },
        {
            id: 5,
            service: "DevOps",
            description:
                "DevOps services to streamline software development and operations, enhancing deployment efficiency and reducing time to market.",
        },
        {
            id: 6,
            service: "Mobile App Development",
            description:
                "Expert mobile app development for iOS and Android platforms, creating intuitive and engaging mobile experiences for your users.",
        },
    ];
    return (
        <section className="w-full flex flex-col items-center mb-32">
            <div className="text-2xl font-bold -translate-y-20 px-4 py-3 relative group">
                <h1 className="group-hover:-translate-y-3 duration-500  cursor-pointer bg-white">
                    Top niches
                </h1>
                <span className="-z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-6 group-hover:translate-y-0.5 duration-500">&darr;</span>
            </div>
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-5 justify-center">
                {services.map((service) => (
                    <div key={service.id} className="w-72 rounded-lg bg-red-200 p-4 cursor-default hover:bg-red-300 hover:-translate-y-0.5 duration-200">
                        <h4 className="text-xl font-bold">{service.service}</h4>
                        <p>{service.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default TopNiches;
