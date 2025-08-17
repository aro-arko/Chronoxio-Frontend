/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import Image from "next/image";

import homeBanner from "../../../app/assets/images/homebanner.webp";
import taskIllustration from "../../../app/assets/images/tasks.jpg";
import progressIllustration from "../../../app/assets/images/progress.avif";
import successIllustration from "../../../app/assets/images/successs.jpg";
import timeIllustration from "../../../app/assets/images/time.jpg";
import { useUser } from "@/context/UserContext";

import type { StaticImageData } from "next/image";

function FeatureCard({
  image,
  title,
  text,
  reverse,
  contain,
}: {
  image: string | StaticImageData;
  title: string;
  text: string;
  reverse?: boolean;
  contain?: boolean;
}) {
  return (
    <div className="grid items-center gap-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-sm sm:p-6 lg:p-8">
      <div
        className={`grid w-full items-center gap-6 ${
          reverse ? "lg:grid-cols-[1fr_48%]" : "lg:grid-cols-[48%_1fr]"
        }`}
      >
        {/* Image */}
        <div className={reverse ? "order-2 lg:order-2" : "order-2 lg:order-1"}>
          <div className="relative h-[220px] w-full rounded-xl shadow-md sm:h-[280px] md:h-[320px] overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className={contain ? "object-contain bg-white" : "object-cover"}
              priority={false}
            />
          </div>
        </div>

        {/* Copy */}
        <div className={reverse ? "order-1 lg:order-1" : "order-1 lg:order-2"}>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl">
            {title}
          </h2>
          <p className="text-[15px] leading-relaxed text-neutral-600 sm:text-base">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useUser();
  return (
    <main className="min-h-screen antialiased">
      {/* Hero (white, text left, image right) */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-0 py-12 sm:px-6 md:px-0 lg:grid-cols-2 lg:px-0 lg:py-20">
          {/* Left: copy */}
          <div className="order-2 space-y-5 text-neutral-900 lg:order-1">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-700 sm:text-xs">
              #1 Productivity App
            </span>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              See why teams choose{" "}
              <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                Chronoxio
              </span>{" "}
              for Task Management.
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
              Chronoxio’s flexible, user-friendly task boards help individuals
              and teams track tasks, monitor progress, and optimize time.
            </p>

            <div className="flex flex-wrap gap-3 pt-1.5">
              <Link
                href={`${user?.role}/dashboard`}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-600 sm:text-base"
              >
                Get Started
              </Link>
              <Link
                href="/about-us"
                className="inline-flex items-center justify-center rounded-lg border border-blue-500/80 bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow hover:bg-blue-50 sm:text-base"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right: image */}
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-2xl bg-white">
              <Image
                src={homeBanner}
                alt="Chronoxio home banner"
                priority
                className="h-auto w-full"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl space-y-8 px-4 sm:px-6 lg:px-0">
          <FeatureCard
            image={taskIllustration}
            title="Create Tasks Effortlessly"
            text="Plan your day in seconds. With intuitive forms and built-in priority settings, Chronoxio lets you create and organize tasks faster than ever."
            contain
          />
          <FeatureCard
            image={timeIllustration}
            title="Track Time in Real-Time"
            text="Stay on top of your productivity. Chronoxio automatically records how long you spend on tasks so you can focus on what matters."
            reverse
            contain
          />
          <FeatureCard
            image={progressIllustration}
            title="Visualize Your Progress"
            text="From daily logs to yearly reports, get clear, actionable insights with beautiful charts and stats that help you grow every day."
            contain
          />
          <FeatureCard
            image={successIllustration}
            title="Compete. Climb. Celebrate."
            text="Turn productivity into a game. Earn points, beat your records, and see where you stand on the leaderboard — solo or with your team."
            reverse
            contain
          />
        </div>
      </section>

      {/* CTA strip */}
      {!user && (
        <section className="bg-white py-12 sm:py-14">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-0">
            <div className="rounded-2xl border border-neutral-200 bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-white shadow-lg sm:p-7">
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                    Ready to boost your team’s productivity?
                  </h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-white/90 sm:text-base">
                    Get started with Chronoxio and ship more, faster — together.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/join-us"
                    className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow hover:bg-white/90 sm:text-base"
                  >
                    Create Free Account
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-lg border border-white/70 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 sm:text-base"
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
