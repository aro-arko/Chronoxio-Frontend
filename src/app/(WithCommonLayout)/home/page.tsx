import Home from "@/components/modules/Home/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chronoxio",
  description: "Welcome to Chronoxio, your productivity companion.",
};

const HomePage = () => {
  return (
    <div>
      <Home />
    </div>
  );
};

export default HomePage;
