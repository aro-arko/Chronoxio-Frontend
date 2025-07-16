"use client";

import * as React from "react";
import { Home, LayoutDashboard, User, CalendarCheck } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

import { useUser } from "@/context/UserContext";
import { NavMain, NavItem } from "./nav-main";
import { NavUser } from "./nav-user";

const getSidebarItems = (): NavItem[] => [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/user/dashboard", icon: LayoutDashboard },
  {
    title: "Tasks",
    url: "/user/tasks",
    icon: CalendarCheck,
    children: [
      { title: "Create Task", url: "/user/createtask" },
      { title: "All Tasks", url: "/user/alltasks" },
      { title: "Completed", url: "/user/completed" },
      { title: "Pending", url: "/user/pending" },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  const [sidebarItems] = React.useState<NavItem[]>(getSidebarItems());

  // Map IUser → UserDetails for NavUser
  const userDetails =
    user != null
      ? {
          name: "User",
          email: user.email || "",
        }
      : null;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={sidebarItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser userDetails={userDetails} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
