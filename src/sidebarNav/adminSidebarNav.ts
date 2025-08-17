import {
  BarChart3,
  CalendarCheck,
  Home,
  LayoutDashboard,
  TrophyIcon,
  UserIcon,
} from "lucide-react";

const adminNavMain = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Tasks", url: "/admin/tasks", icon: CalendarCheck },
  { title: "Leaderboard", url: "/admin/leaderboard", icon: TrophyIcon },
  { title: "Reports", url: "/admin/reports", icon: BarChart3 },
  { title: "Users", url: "/admin/users", icon: UserIcon },
];
