// app/app/dashboard/page.tsx (or wherever your page is)
import UserDashboard from "@/components/modules/UserDashboard/UserDashboard";
import { getWeeklyReport, getTasksForDashboard } from "@/services/TaskService";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

const DashboardPage = async () => {
  const [weeklyReport, tasks] = await Promise.all([
    getWeeklyReport(),
    getTasksForDashboard(),
  ]);

  return (
    <div>
      <UserDashboard weeklyReport={weeklyReport} tasks={tasks} />
    </div>
  );
};

export default DashboardPage;
