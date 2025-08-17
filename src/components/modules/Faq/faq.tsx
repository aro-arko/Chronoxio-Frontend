"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const faqs = [
  {
    question: "What is Chronoxio?",
    answer:
      "Chronoxio is a task and time-management platform that helps you plan work, track progress, and gain insights with lightweight analytics.",
  },
  {
    question: "Is Chronoxio free?",
    answer:
      "Yes. Chronoxio is currently 100% free during early access. No credit card is required, and all available features are included in the free plan.",
  },
  {
    question: "Can I invite teammates or create a team workspace?",
    answer:
      "Not yet. Team workspaces and invite links are on our roadmap. For now, Chronoxio is focused on personal productivity. We’ll announce team features when they’re ready.",
  },
  {
    question: "Does Chronoxio support time tracking?",
    answer:
      "Absolutely. You can start a timer on any task or log time manually, then review summaries by date range — all included in the free plan.",
  },
];

const FAQComponent = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className={`bg-white py-16 px-4 sm:px-6 lg:px-0`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
            Frequently Asked Questions
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Find answers about Chronoxio and how to get more out of it.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              viewport={{ once: true }}
              className="border border-neutral-200 rounded-xl"
            >
              <AccordionItem
                value={`item-${index}`}
                className={`rounded-lg px-6 py-2 transition-all `}
              >
                <AccordionTrigger className="text-left font-medium py-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-neutral-600 dark:text-neutral-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <h3 className="text-lg font-medium mb-4">Still have questions?</h3>
          <p className="text-neutral-600 dark:text-neutral-300 mb-6">
            Contact our team and we’ll be happy to assist you.
          </p>
          <Link href="/contact">
            <Button className="bg-primary text-white hover:bg-primary/90 cursor-pointer">
              Contact Support
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default FAQComponent;
