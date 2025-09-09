"use client";

import React from "react";
import {
  Star,
  ShieldCheck,
  DollarSign,
  Clock,
  Lock,
  Check,
} from "lucide-react";
import CountUp from "react-countup";
import LeadForm from "./components/LeadForm";
import Carousel from "@/app/components/ui/carousel";
import { topics_list, reviews, standoutItems } from "@/data/home_page";

export default function MainPage() {
  return (
    <main className="font-sans">
      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-900 py-30 relative">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-start md:items-center md:justify-between">
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Ideas Built to Succeed
            </h1>
            <p className="text-lg opacity-90 mb-6">
              From concept to completion, we craft smart, scalable solutions
              that help your business grow.
            </p>

            <div className="grid grid-cols-2 gap-4 justify-center md:justify-start mb-8 text-sm font-medium">
              <div className="flex items-center space-x-2 bg-white p-2 rounded-full pl-6">
                <ShieldCheck className="w-5 h-5 text-blue-600 m-2 rounded-xl" />
                <span>AI + Plagiarism Free Content</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-2 rounded-full pl-6">
                <DollarSign className="w-5 h-5 text-blue-600 m-2 rounded-xl" />
                <span>Money Back Guarantee</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-2 rounded-full pl-6">
                <Clock className="w-5 h-5 text-blue-600 m-2 rounded-xl" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2 bg-white p-2 rounded-full pl-6">
                <Lock className="w-5 h-5 text-blue-600 m-2 rounded-xl" />
                <span>Security & Confidentiality</span>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 mt-15 md:mt-0 flex justify-center">
            <LeadForm
              fields={{
                ProjectType: { type: "dropdown", options: topics_list },
                ProjectTitle: { type: "text" },
                Email: { type: "text" },
              }}
            />
          </div>
        </div>

        {/* Bottom Ratings */}
        <div className="absolute bottom-4 left-4 flex space-x-10 items-center bg-white p-4 ml-10 rounded-lg shadow">
          {[
            { src: "/site_jabber.png", rating: 4.84 },
            { src: "/reviewsIO.png", rating: 4.71 },
            { src: "/review_centre.png", rating: 4.88 },
          ].map((item, i) => {
            const ratingNumber = Number(item?.rating ?? 0);
            return (
              <div key={i} className="flex items-center space-x-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-md font-bold text-gray-700">
                  {ratingNumber.toFixed(1)}
                </span>
                <img
                  src={item?.src ?? "/placeholder.png"}
                  alt="Rating"
                  className="h-8 w-auto object-contain"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ABOUT US */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-4 items-center">
          <div className="flex flex-col justify-center space-y-6 text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-gray-800">About Us</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At <span className="font-semibold">Global Project Solutions</span>, writing isn’t just a
              service—it’s our craft. We’re veterans of the written word, shaping ideas into clear,
              engaging content that connects with readers and delivers real impact. We believe that
              great results come from genuine cooperation, so every project is a partnership where
              your goals drive the story. From strategy to final draft, we keep the process simple,
              collaborative, and focused on quality.
            </p>

            <div className="text-gray-800 text-3xl font-extrabold">GPS Stats</div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Check className="w-8 h-8 text-black flex-shrink-0 bg-blue-50 rounded-full p-2" />
                <span className="text-gray-700">
                  <CountUp end={12} suffix="+" duration={2.2} enableScrollSpy/> years of proven expertise.
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-8 h-8 text-black flex-shrink-0 bg-blue-50 rounded-full p-2" />
                <span className="text-gray-700">
                  <CountUp end={20000} separator="," suffix="+" duration={3} enableScrollSpy /> projects delivered.
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-8 h-8 text-black flex-shrink-0 bg-blue-50 rounded-full p-2" />
                <span className="text-gray-700">
                  <CountUp end={99.2} decimals={1} suffix="%" duration={2} enableScrollSpy /> success rate.
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            {["about1", "about2", "about3", "about4"].map((name) => (
              <img
                key={name}
                src={`/about_us_pics/${name}.png`}
                alt={name}
                className="w-full h-48 md:h-64 object-cover rounded-xl shadow"
              />
            ))}
          </div>
        </div>
      </section>

      {/* WHAT MAKES US STAND OUT */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-4 items-start">
          {/* Left intro */}
          <div className="flex flex-col justify-center text-center md:text-left space-y-4">
            <h2 className="text-4xl font-bold text-gray-800">What Makes Us Stand Out</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              We combine experience, creativity, and precision to craft writing that truly connects, 
              engages, and drives real results. Every project begins with understanding your goals, 
              audience, and brand voice so the message feels authentic and compelling. Whether it’s 
              a short campaign or an in-depth strategy, we focus on clarity, tone, and impact—turning 
              complex ideas into content that inspires trust and action. Here’s why clients keep 
              coming back to work with us.
            </p>
          </div>

          {/* Right carousel for standoutItems */}
          <div className="md:col-span-2">
            <Carousel
              items={standoutItems}
              renderItem={(item, i) => (
                <div
                  key={i}
                  className="relative shrink-0 snap-start w-[400px] h-[400px] rounded-lg flex flex-col"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-60 object-cover rounded-tr-lg rounded-tl-lg"
                  />
                  <h3 className="font-semibold text-gray-800 text-lg p-4 pt-3 pb-1">{item.title}</h3>
                  <p className="text-gray-700 text-sm p-r-4 pl-4">{item.description}</p>
                </div>
              )}
            />
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 items-start">
          {/* LEFT IMAGES – Single Column */}
          <div className="flex flex-col gap-10">
            {["how1", "how2", "how3"].map((img) => (
              <img
                key={img}
                src={`/how_we_work/${img}.png`}
                alt={img}
                className="w-full h-50 md:h-64 object-cover rounded-lg shadow-lg"
              />
            ))}
          </div>

          {/* RIGHT TIMELINE TEXT */}
          <div className="relative pl-10">
            {/* Vertical line OPTIONAL */}
            {/* <div className="absolute left-2 top-0 h-full w-[2px] bg-blue-500 rounded-full"></div> */}

            <h2 className="text-4xl font-bold text-gray-800 mb-6">How We Work</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-10">
              We believe a clear process leads to stronger results. Each stage keeps you
              informed, aligned, and confident in where the project stands, while our team
              focuses on delivering work with precision, quality, and realistic deadlines.
            </p>

            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative pl-12">
                <div className="absolute left-[-0.75rem] top-1/2 transform -translate-y-1/2">
                  <Check className="w-8 h-8 text-blue-600 bg-blue-50 rounded-full p-2 shadow" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Discovery & Goals</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We begin with thoughtful conversations to uncover your objectives,
                  audience, and brand values. By understanding what success looks like to
                  you, we can set a foundation of trust and create a roadmap that feels
                  purposeful rather than rushed or improvised.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative pl-12">
                <div className="absolute left-[-0.75rem] top-1/2 transform -translate-y-1/2">
                  <Check className="w-8 h-8 text-blue-600 bg-blue-50 rounded-full p-2 shadow" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Planning & Drafting</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Next, we translate insights into a clear plan, mapping milestones and
                  deliverables so you always know what’s next. Our drafts are built around
                  your tone and vision, and we actively invite input so alignment is
                  maintained from day one.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative pl-12">
                <div className="absolute left-[-0.75rem] top-1/2 transform -translate-y-1/2">
                  <Check className="w-8 h-8 text-blue-600 bg-blue-50 rounded-full p-2 shadow" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Review & Refine</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We treat refinement as a partnership. Feedback cycles are structured yet
                  flexible, giving you space to respond thoughtfully. Each round sharpens
                  the details—ensuring clarity, polish, and a finished product that truly
                  represents your brand’s personality.
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative pl-12">
                <div className="absolute left-[-0.75rem] top-1/2 transform -translate-y-1/2">
                  <Check className="w-8 h-8 text-blue-600 bg-blue-50 rounded-full p-2 shadow" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Delivery & Support</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Once your approval is final, we deliver clean, ready-to-use assets on
                  schedule—no last-minute scrambling. Our commitment doesn’t stop there:
                  we remain available for follow-ups, small tweaks, and ongoing support as
                  your project grows or evolves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS CAROUSEL */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-center text-gray-600 mb-10 text-lg">
            All profiles are verified by us so that you only get genuine details.
          </p>

          <Carousel
            items={reviews}
            renderItem={(review, i) => (
              <div
                key={i}
                className="relative shrink-0 snap-start w-[340px] md:w-[400px] bg-white rounded-xl transition p-6 flex flex-col"
              >
                {/* Rating Stars */}
                <div className="absolute top-3 right-3 flex space-x-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-5 h-5 ${
                        idx < Math.round(review.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Reviewer Info */}
                <div className="flex items-center gap-4 mb-6">
                  {review.avatar ? (
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-16 h-16 rounded-full object-cover shadow"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 shadow">
                      {review.name?.[0] ?? "?"}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{review.name}</p>
                    {review.profile && (
                      <p className="text-sm text-gray-500">{review.profile}</p>
                    )}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {/* Projects */}
                  <div className="bg-gray-50 rounded-md p-3 text-center transition-all duration-200 transform hover:-translate-y-1 hover:bg-gray-200">
                    <p className="text-lg font-bold text-gray-800">
                      <CountUp end={review.projects} duration={1.6} enableScrollSpy />
                    </p>
                    <p className="text-gray-500">Projects Ordered</p>
                  </div>

                  {/* Avg Score */}
                  <div className="bg-gray-50 rounded-md p-3 text-center transition-all duration-200 transform hover:-translate-y-1 hover:bg-gray-200">
                    <p className="text-lg font-bold text-gray-800">
                      <CountUp end={review.avgScore} decimals={2} duration={1.6} enableScrollSpy />
                    </p>
                    <p className="text-gray-500">Average Score</p>
                  </div>

                  {/* Years */}
                  <div className="bg-gray-50 rounded-md p-3 text-center col-span-2 transition-all duration-200 transform hover:-translate-y-1 hover:bg-gray-200">
                    <p className="text-lg font-bold text-gray-800">
                      <CountUp end={review.years} duration={1.6} enableScrollSpy /> years
                    </p>
                    <p className="text-gray-500">With Us</p>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
          <p className="text-gray-600 text-lg mb-12">
            Proven results, lasting partnerships, and measurable impact across every project.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Years of Experience */}
            <div className="bg-gray-50 rounded-xl p-6 shadow hover:-translate-y-1 transform transition">
              <p className="text-4xl font-extrabold text-blue-600">
                <CountUp end={10} duration={2} enableScrollSpy />+
              </p>
              <p className="text-gray-500 mt-2">Years of Experience</p>
            </div>

            {/* Projects Delivered */}
            <div className="bg-gray-50 rounded-xl p-6 shadow hover:-translate-y-1 transform transition">
              <p className="text-4xl font-extrabold text-blue-600">
                <CountUp end={1250} separator="," duration={2} enableScrollSpy />
              </p>
              <p className="text-gray-500 mt-2">Projects Delivered</p>
            </div>

            {/* Average Rating */}
            <div className="bg-gray-50 rounded-xl p-6 shadow hover:-translate-y-1 transform transition flex flex-col items-center">
              <div className="flex items-center text-blue-600">
                <span className="text-4xl font-extrabold">
                  <CountUp end={4.9} decimals={1} duration={2} enableScrollSpy/>
                </span>
                <Star className="w-7 h-7 mr-2 fill-blue-600 ml-1" />
              </div>
              <p className="text-gray-500 mt-2">Average Rating</p>
            </div>

            {/* Repeat Clients */}
            <div className="bg-gray-50 rounded-xl p-6 shadow hover:-translate-y-1 transform transition">
              <p className="text-4xl font-extrabold text-blue-600">
                <CountUp end={87} duration={2} enableScrollSpy/>%
              </p>
              <p className="text-gray-500 mt-2">Repeat Clients</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
