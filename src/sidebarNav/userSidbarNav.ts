import {
  BarChart3,
  CalendarCheck,
  Home,
  LayoutDashboard,
  TrophyIcon,
} from "lucide-react";

export const userNavMain = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/user/dashboard", icon: LayoutDashboard },
  { title: "Tasks", url: "/user/tasks", icon: CalendarCheck },
  { title: "Leaderboard", url: "/user/leaderboard", icon: TrophyIcon },
  { title: "Reports", url: "/user/reports", icon: BarChart3 },
];
