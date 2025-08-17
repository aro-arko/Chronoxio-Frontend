import FaqSection from "@/components/modules/Faq/faq";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about Chronoxio.",
};

const FaqPage = () => {
  return (
    <div className="pt-16">
      <FaqSection />
    </div>
  );
};

export default FaqPage;
