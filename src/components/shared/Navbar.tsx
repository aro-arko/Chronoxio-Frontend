"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User as UserIcon,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 🔐 If you use your own user context
import { useUser } from "@/context/UserContext";
import { logout } from "@/services/AuthService";
import { protectedRoutes } from "@/constants";

const FALLBACK_AVATAR = "/avatar-fallback.png";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "FAQs", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  const { user, setUser } = useUser();
  const roleSlug = (user?.role || "").toLowerCase();
  const dashboardHref =
    roleSlug === "admin"
      ? "/admin/dashboard"
      : roleSlug
      ? `/${roleSlug}/dashboard`
      : "/";

  const isActive = (path: string) => pathname === path;

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);

  const onLogout = async () => {
    try {
      await logout(); // clear cookie on server
    } finally {
      try {
        new BroadcastChannel("auth").postMessage("logout");
      } catch {}
      try {
        localStorage.setItem("auth:ping", String(Date.now()));
      } catch {}
      setUser(null);
      if (protectedRoutes.some((route) => pathname.match(route))) {
        router.push("/");
      }
    }
  };

  const linkBase =
    "px-3 py-2 text-sm font-medium rounded-md transition-all duration-300";
  const linkActive = "bg-blue-500 text-white shadow-md";
  const linkIdle = "text-neutral-700 hover:text-blue-600 hover:bg-gray-100";

  return (
    <nav
      className={[
        "fixed w-full z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-neutral-200"
          : "bg-white border-neutral-200",
      ].join(" ")}
      aria-label="Main"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-6 lg:px-0">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <Link href="/" className="flex items-center" aria-label="Chronoxio">
            <h1 className="text-2xl font-bold">Chronoxio</h1>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={[
                  linkBase,
                  isActive(link.href) ? linkActive : linkIdle,
                ].join(" ")}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Account area */}
            {!user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-medium border border-blue-600 text-blue-600 hover:bg-blue-600/10"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full px-4 py-2 text-sm font-medium text-white bg-blue-600 shadow hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-full px-3 py-2 h-9"
                      aria-label="Account menu"
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">Account</span>
                      <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 border border-neutral-200"
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center gap-3">
                        {/* Avatar (Image-safe) */}
                        <AvatarImage
                          src={user?.avatarUrl}
                          alt={user?.name || "User"}
                          size={32}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {user?.name ?? "Member"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user?.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={dashboardHref}
                        className="w-full flex items-center"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              className="md:hidden p-2 rounded-md hover:bg-neutral-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-neutral-700" />
              ) : (
                <Menu className="h-6 w-6 text-neutral-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-neutral-200 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={[
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-blue-600/10 text-blue-700"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-blue-600",
                  ].join(" ")}
                >
                  {link.name}
                </Link>
              ))}

              {!user ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center rounded-full px-4 py-2 mt-2 text-base font-medium text-white bg-blue-600 shadow hover:bg-blue-700 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center rounded-full px-4 py-2 text-base font-medium border border-blue-600 text-blue-600 hover:bg-blue-600/10"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={dashboardHref}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left rounded-md px-3 py-2 text-base font-medium hover:bg-neutral-100"
                  >
                    <span className="inline-flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </span>
                  </Link>
                  <button
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await onLogout();
                    }}
                    className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-600/10"
                  >
                    <span className="inline-flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Log out
                    </span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/** Image-safe avatar with graceful fallbacks */
function AvatarImage({
  src,
  alt,
  size = 36,
}: {
  src?: string | null;
  alt: string;
  size?: number;
}) {
  const [error, setError] = React.useState(false);

  // If no src or it failed, show fallback image
  if (!src || error) {
    return (
      <Image
        src={FALLBACK_AVATAR}
        alt={alt}
        width={size}
        height={size}
        className="rounded-full object-cover"
        sizes={`${size}px`}
      />
    );
  }

  // Remote images require domain allowlist in next.config (see below)
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      sizes={`${size}px`}
      className="rounded-full object-cover"
      onError={() => setError(true)}
    />
  );
}
