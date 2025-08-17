import Contact from "@/components/modules/Contact/contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Chronoxio team.",
};

const ContactPage = () => {
  return (
    <div className="pt-16">
      <Contact />
    </div>
  );
};

export default ContactPage;
