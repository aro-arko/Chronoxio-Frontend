"use client";

import { useUser } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

type TeamMember = {
  name: string;
  role: string;
  img: string; // local (/images/...) or remote (https://...)
};

const team: TeamMember[] = [
  {
    name: "Abidur Rahman Arko",
    role: "Chief Technology Officer",
    img: "https://www.aro-arko.software/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FprofileImage.497e7112.jpg&w=1920&q=75",
  },
  {
    name: "Hr Irfan",
    role: "Frontend Developer & System Analyst",
    img: "https://scontent.fkul4-3.fna.fbcdn.net/v/t39.30808-6/518393059_122234665760081233_2615029208159413532_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeFLcOQ4U898WEXEYYB7wY-KEbO9lgknWqERs72WCSdaobW38DGTYjK14gs7pw9gcT43LtFCQ4o0lliKjN1xJg4k&_nc_ohc=OnHrDQwXUacQ7kNvwHUrA4u&_nc_oc=AdlZnEvF1PSvXUAh2zUGHDvi33SV_O5kdMnHPzcRvkWp2vwBjXbLo4mTAYoaHmv2AcU&_nc_zt=23&_nc_ht=scontent.fkul4-3.fna&_nc_gid=JuouYhBby3yOvdkHxielTQ&oh=00_AfVgqyULfM8e7E8O0faT9Nk4iE-tEdgfhrhpizH7XCw8nQ&oe=68A6D435",
  },
  {
    name: "Lawrance",
    role: "Product Designer",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Abyaz Ahmed",
    role: "Marketing Strategist",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

// Illustration used in your reference
const ILLUSTRATION =
  "https://bookshop-frontend-six.vercel.app/assets/bookIllustartion-BLC8-3VP.jpeg";

export default function About() {
  const { user } = useUser();
  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <section className=" px-6 py-20 text-center sm:py-24">
        <h1 className="text-4xl font-bold ">About Us</h1>
        <p className="mx-auto mt-4 max-w-3xl text-base opacity-90 sm:text-lg md:text-xl">
          Helping people manage their time, tasks, and productivity through a
          smart and intuitive platform.
        </p>
      </section>

      {/* Who We Are + Illustration (two-column like your example) */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-0">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-md transition-shadow duration-300 hover:shadow-2xl">
            <h2 className="mb-4 text-3xl font-bold text-gray-800">
              Who We Are
            </h2>
            <p className="leading-relaxed text-gray-700">
              Welcome to{" "}
              <span className="font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Chronoxio
              </span>
              , your productivity companion for modern work. Whether you’re
              planning solo sprints or coordinating teams, we provide intuitive
              tools to create tasks, track time, analyze progress, and celebrate
              wins.
            </p>
          </div>

          <div className="flex items-center justify-center rounded-xl border border-gray-100 p-4 shadow-md">
            <Image
              src={ILLUSTRATION}
              alt="Productivity Illustration"
              width={1000}
              height={600}
              className="h-[200px] w-full rounded-lg object-cover"
              unoptimized // remote domain; skip optimizer unless next.config.js allows it
            />
          </div>
        </div>
      </section>

      {/* Mission (single card like the example) */}
      <section className="mx-auto max-w-7xl px-4 lg:px-0">
        <div className="mt-8 rounded-xl border border-gray-100 p-8 text-gray-800 shadow-md">
          <h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
          <p className="leading-relaxed">
            At <span className="font-bold">Chronoxio</span>, we believe
            productivity should feel simple, focused, and rewarding. Our mission
            is to help everyone plan better, work smarter, and grow every day —
            with clarity, insight, and a little bit of fun.
          </p>
        </div>
      </section>

      {/* Highlights (4 cards, emoji-style like the reference) */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-0">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: "✅",
              title: "Smart Tasking",
              desc: "Create tasks with priorities and deadlines in seconds.",
            },
            {
              icon: "⏱️",
              title: "Real-Time Tracking",
              desc: "Track effort seamlessly and stay on top of your day.",
            },
            {
              icon: "📈",
              title: "Clear Insights",
              desc: "Visualize progress with clean charts and reports.",
            },
            {
              icon: "🎯",
              title: "Motivation Built-In",
              desc: "Gamified goals to keep momentum and celebrate wins.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-md"
            >
              <div className="mb-4 text-4xl">{card.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800">
                {card.title}
              </h3>
              <p className="mt-2 text-gray-600">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values (kept from your original) */}
      <section className="bg-slate-100 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="mb-10 text-2xl font-bold text-slate-900 sm:mb-12 sm:text-3xl">
            Core Values
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            {[
              {
                title: "Transparency",
                desc: "We build trust by being open and honest with users and teammates.",
                color: "text-indigo-600",
              },
              {
                title: "Innovation",
                desc: "We explore bold ideas and deliver delightful, modern solutions.",
                color: "text-rose-600",
              },
              {
                title: "User First",
                desc: "Every decision is driven by what serves our users best.",
                color: "text-teal-600",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-white p-6 text-left shadow transition hover:shadow-md"
              >
                <h3
                  className={`mb-2 text-lg font-semibold sm:text-xl ${item.color}`}
                >
                  {item.title}
                </h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment (like the example) */}
      <section className="mx-auto max-w-7xl px-4 lg:px-0">
        <div className="mt-8 rounded-xl border border-gray-100 bg-white p-8 text-gray-800 shadow-md">
          <h2 className="mb-4 text-3xl font-bold">Our Commitment</h2>
          <p className="leading-relaxed text-gray-600">
            We prioritize a smooth, empowering experience — from creating your
            first task to tracking outcomes across a whole year. Your success is
            our goal, and we continually refine Chronoxio to help you focus,
            finish, and flourish.
          </p>
        </div>
      </section>

      {/* Meet the Team (kept, using safe remote images) */}
      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="mb-10 text-2xl font-bold text-slate-900 sm:mb-12 sm:text-3xl">
            Meet the Team
          </h2>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 md:gap-10">
            {team.map((member) => {
              const isRemote = member.img.startsWith("http");
              return (
                <div key={member.name} className="text-center">
                  <div className="mx-auto h-24 w-24 overflow-hidden rounded-full shadow">
                    <Image
                      src={member.img}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                      unoptimized={isRemote}
                    />
                  </div>
                  <h3 className="mt-3 text-base font-semibold sm:text-lg">
                    {member.name}
                  </h3>
                  <p className="text-xs text-gray-500 sm:text-sm">
                    {member.role}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-100 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl rounded-xl bg-white px-8 py-12 text-center shadow-lg sm:px-10 sm:py-14">
          <div className="mb-5">
            <svg
              className="mx-auto h-12 w-12 text-indigo-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h2 className="mb-3 text-2xl font-bold text-gray-800 sm:text-3xl">
            Start Your Productivity Journey With Us!
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base text-gray-600 sm:text-lg">
            Explore Chronoxio’s tools and find your rhythm. Plan tasks, track
            time, review insights, and keep your momentum.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href={`${user?.role}/dashboard`}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90"
            >
              Go to Dashboard
            </Link>
            {!user && (
              <Link
                href="/join-us"
                className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
              >
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
