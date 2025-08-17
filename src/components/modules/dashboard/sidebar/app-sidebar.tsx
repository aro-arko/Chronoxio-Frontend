/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  Home,
  LayoutDashboard,
  CalendarCheck,
  Trophy,
  BarChart3,
  User as UserIcon,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

import { useUser } from "@/context/UserContext";
import { NavMain, NavItem } from "./nav-main";
import { NavUser } from "./nav-user";

// ---- Nav configs ----
const adminNavMain: NavItem[] = [
  { title: "Home", url: "/", icon: Home },
  { title: "Profile", url: "/admin/profile", icon: User },
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Tasks", url: "/admin/tasks", icon: CalendarCheck },
  { title: "Leaderboard", url: "/admin/leaderboard", icon: Trophy },
  { title: "Reports", url: "/admin/reports", icon: BarChart3 },
  { title: "Users", url: "/admin/users", icon: UserIcon },
];

const userNavMain: NavItem[] = [
  { title: "Home", url: "/", icon: Home },
  { title: "Profile", url: "/user/profile", icon: User },
  { title: "Dashboard", url: "/user/dashboard", icon: LayoutDashboard },
  { title: "Tasks", url: "/user/tasks", icon: CalendarCheck },
  { title: "Leaderboard", url: "/user/leaderboard", icon: Trophy },
  { title: "Reports", url: "/user/reports", icon: BarChart3 },
];

const isAdminRole = (role?: string) => !!role && /admin/i.test(role);

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const ctx = useUser();
  // Your hook sometimes exposes role directly, sometimes via user.role
  const role = (ctx as any)?.role ?? (ctx as any)?.user?.role ?? "user";

  const items = React.useMemo<NavItem[]>(
    () => (isAdminRole(role) ? adminNavMain : userNavMain),
    [role]
  );

  const userDetails = (ctx as any)?.user
    ? {
        name: (ctx as any).user.name || "User",
        email: (ctx as any).user.email || "",
      }
    : null;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser userDetails={userDetails} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
