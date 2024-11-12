import React from "react";

function Hero() {
    return (
        <section className="w-full flex flex-col gap-4 items-center justify-center text-center h-screen -translate-y-10 p-6">
            <h1 className="text-6xl font-bold capitalize">
                find your dream job today
            </h1>
            <h4 className="text-2xl font-bold opacity-70 capitalize">
                Connecting talent with opportunities accross the nation for
                every skill level.
            </h4>
            <article className="normal-case md:w-1/2 bg-red-200 hover:bg-red-300 hover:-translate-y-0.5 duration-200 p-8 rounded-3xl text-center">
                Explore a vast array of job listings in diverse industries.
                Whether you're a seasoned professional or just starting out,
                find the perfect role to advance your career. Our platform makes
                job searching easy and efficient, bringing you closer to your
                next big opportunity.
            </article>
        </section>
    );
}

export default Hero;
