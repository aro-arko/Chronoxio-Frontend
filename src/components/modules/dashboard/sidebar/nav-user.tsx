"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/services/AuthService";
import { Separator } from "@/components/ui/separator";
import { protectedRoutes } from "@/constants";
import { useState } from "react";

interface UserDetails {
  name: string;
  email: string;
}

export function NavUser({ userDetails }: { userDetails?: UserDetails | null }) {
  const { isMobile } = useSidebar();
  const { setIsLoading, user, setUser, refreshUser } = useUser();
  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout(); // server-side cookie delete

      // broadcast to all tabs / components
      try {
        new BroadcastChannel("auth").postMessage("logout");
      } catch {}
      try {
        localStorage.setItem("auth:ping", String(Date.now()));
      } catch {}

      // instant UI update in this tab
      setUser(null);
      await refreshUser();
      router.refresh();

      // if you're on a protected route, bounce to /
      if (protectedRoutes.some((route) => pathname.match(route))) {
        router.push("/");
      }
    } finally {
      setIsLoading(false);
      setLoggingOut(false);
    }
  };
  const handleChangePassword = () => {
    router.push(`/${user?.role}/change-password`);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage alt={userDetails?.name} />
                <AvatarFallback className="rounded-lg">
                  {user?.role?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {userDetails?.name || "User"}
                </span>
                <span className="truncate text-xs">
                  {userDetails?.email || ""}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage alt={userDetails?.name} />
                  <AvatarFallback className="rounded-lg">
                    {user?.role?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {userDetails?.name || "User"}
                  </span>
                  <span className="truncate text-xs">
                    {userDetails?.email || ""}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuItem onClick={handleChangePassword}>
              Change Password
            </DropdownMenuItem>
            <Separator className="my-2" />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
