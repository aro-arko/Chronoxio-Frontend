"use client";

import * as React from "react";
import Link from "next/link";
import { FaChartLine, FaTasks, FaUserShield, FaClock } from "react-icons/fa";
import { useUser } from "@/context/UserContext";

type Service = {
  title: string;
  desc: string;
  Icon: React.ComponentType<{ className?: string }>;
  color: string; // text color (e.g., text-indigo-600)
  bgTint: string; // icon background tint (e.g., bg-indigo-50)
};

const services: Service[] = [
  {
    Icon: FaTasks,
    title: "Smart Task Management",
    color: "text-indigo-600",
    bgTint: "bg-indigo-50",
    desc: "Easily organize tasks with categories, deadlines, and reminders.",
  },
  {
    Icon: FaClock,
    title: "Time Tracking",
    color: "text-emerald-600",
    bgTint: "bg-emerald-50",
    desc: "Measure time spent and stay accountable across your projects.",
  },
  {
    Icon: FaChartLine,
    title: "Performance Analytics",
    color: "text-amber-600",
    bgTint: "bg-amber-50",
    desc: "Track progress with visual reports and goal-based analytics.",
  },
  {
    Icon: FaUserShield,
    title: "Secure Data",
    color: "text-rose-600",
    bgTint: "bg-rose-50",
    desc: "Your privacy is protected with enterprise-grade encryption.",
  },
];

export default function Services() {
  const { user } = useUser();
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero (matches About theme) */}
      <section className="px-6 py-16 text-center">
        <h1 className="text-4xl font-bold">What We Offer</h1>
        <p className="mx-auto mt-4 max-w-xl text-base opacity-90 sm:text-lg">
          Explore a suite of powerful tools designed to keep you productive,
          focused, and secure.
        </p>
      </section>

      {/* Services Grid */}
      <section className="px-6 py-14 sm:py-16 md:px-10 lg:px-0">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ Icon, title, desc, color, bgTint }) => (
            <div
              key={title}
              className="group relative rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Accent line on hover */}
              <div className="pointer-events-none absolute inset-x-0 -top-px h-0.5 w-full scale-x-0 bg-gradient-to-r from-blue-600 to-violet-600 transition-transform duration-300 group-hover:scale-x-100" />
              <div
                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl shadow-sm"
                style={{ backgroundColor: "transparent" }}
              >
                <div
                  className={`${bgTint} ${color} inline-flex h-12 w-12 items-center justify-center rounded-xl`}
                >
                  <Icon className="text-2xl" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {user && (
        // CTA (gradient card like About)
        <section className="bg-white pb-16">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-0">
            <div className="rounded-2xl border border-neutral-200 bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-white shadow-lg sm:p-8">
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Start Smarter. Work Better.
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-white/90 sm:text-base">
                    Whether you&apos;re managing tasks solo or leading a team —
                    Chronoxio makes it simple and powerful.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`${user.role}/dashboard`}
                    className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow hover:bg-white/90"
                  >
                    Get Started Now
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center rounded-lg border border-white/70 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
