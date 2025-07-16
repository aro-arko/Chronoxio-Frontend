import UserDashboard from "@/components/modules/UserDashboard/UserDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Student Dashboard",
};

const DashboardPage = () => {
  return (
    <div>
      <UserDashboard />
    </div>
  );
};

export default DashboardPage;
