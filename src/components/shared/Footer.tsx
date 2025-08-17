"use client";

import { useState } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Twitter,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() !== "") {
      setIsSubmitted(true);
      setEmail(""); // Clear input after submission
      setTimeout(() => setIsSubmitted(false), 4000); // Hide message after 4 seconds
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Chronoxio</h3>
          <p className="text-sm text-gray-400">
            Simplify your workflow and stay organised. Chronoxio helps teams and
            individuals plan, track, and achieve their goals efficiently.
          </p>
          <div className="flex space-x-4">
            <Link
              href="https://www.facebook.com/aroarko28/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="https://x.com/aroarko28"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://www.instagram.com/aroarko"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/aroarko/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/tasks"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                My Tasks
              </Link>
            </li>
            <li>
              <Link
                href="/teams"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Teams
              </Link>
            </li>
            <li>
              <Link
                href="/reports"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Reports
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Contact Us</h4>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-400">
                support@chronoxio.com
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-400">+1 (234) 567-8901</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Newsletter</h4>
          <p className="text-sm text-gray-400">
            Subscribe to get updates about new features, tips, and product news.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-3 py-2 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </div>
            {isSubmitted && (
              <p className="text-sm text-green-500">
                ✅ Subscribed successfully!
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 mt-2 pt-2 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Chronoxio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
