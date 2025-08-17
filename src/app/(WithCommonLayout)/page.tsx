import Home from "@/components/modules/Home/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chronoxio",
  description: "Manage your tasks efficiently",
};

const HomePage = () => {
  return (
    <div className="pt-16">
      <Home />
    </div>
  );
};

export default HomePage;
