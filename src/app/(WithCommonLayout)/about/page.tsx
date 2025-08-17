import About from "@/components/modules/About/About";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about our team and mission at Chronoxio.",
};

const AboutPage = () => {
  return (
    <div className="pt-16">
      <About />
    </div>
  );
};

export default AboutPage;
