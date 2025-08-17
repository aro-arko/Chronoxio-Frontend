"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setError("");
      setFormData({ name: "", email: "", message: "" });
    } else {
      setSubmitted(false);
      setError("Please fill in all fields.");
    }
  };

  return (
    <section
      className={`min-h-screen py-16 px-4 sm:px-6 lg:px-0 transition-colors duration-300`}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-12 max-w-2xl mx-auto"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-sm sm:text-base md:text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
          Whether you&apos;re curious about joining, collaborating, or just
          saying hi — we&apos;re happy to hear from you.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-white p-8 rounded-xl shadow-md dark:bg-white/5 dark:border dark:border-white/10 dark:backdrop-blur-md">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Send a Message
            </h2>
            <p className="text-sm text-gray-600 dark:text-neutral-300 mb-6">
              Fill out the form and we’ll get back to you shortly.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
              />
              <Input
                name="email"
                type="email"
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
              />
              <Textarea
                name="message"
                placeholder="Your message"
                value={formData.message}
                onChange={handleChange}
                className="min-h-[120px]"
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
              {submitted && (
                <div className="flex items-center gap-2 text-green-600 text-sm mt-2">
                  <FaCheckCircle className="text-green-600" /> Message sent
                  successfully!
                </div>
              )}
              {error && <p className="text-blue-500 text-sm mt-2">{error}</p>}
            </form>
          </div>
        </motion.div>

        {/* Contact Info & Map */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {/* Contact Information */}
          <div className="bg-white p-8 rounded-xl shadow-md dark:bg-white/5 dark:border dark:border-white/10 dark:backdrop-blur-md">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <span className="text-2xl text-blue-600">
                  <FaMapMarkerAlt />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Address
                  </h3>
                  <p className="text-gray-600 dark:text-neutral-300">
                    UCSI Heights, 1, Jln UCSI, Taman Connaught, Cheras
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <span className="text-2xl text-blue-600">
                  <FaPhone />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Phone
                  </h3>
                  <p className="text-gray-600 dark:text-neutral-300">
                    +123 456 7890
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <span className="text-2xl text-blue-600">
                  <FaEnvelope />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Email
                  </h3>
                  <p className="text-gray-600 dark:text-neutral-300">
                    support@chronoxio.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white p-8 rounded-xl shadow-md dark:bg-white/5 dark:border dark:border-white/10 dark:backdrop-blur-md">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Our Location
            </h2>
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
              <iframe
                title="UCSI Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15927.373680271358!2d101.73595205639647!3d3.074198939530305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc3626d12b214b%3A0x81bdf1526e8ea91b!2sUCSI%20University%20Kuala%20Lumpur%20Campus!5e0!3m2!1sen!2smy!4v1708170000000!5m2!1sen!2smy"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
