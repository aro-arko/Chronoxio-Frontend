import Services from "@/components/modules/Services/Services";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "Learn more about our services at Chronoxio.",
};

const ServicesPage = () => {
  return (
    <div className="pt-16">
      <Services />
    </div>
  );
};

export default ServicesPage;
