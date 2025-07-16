// "use client";
// import { useEffect, useState } from "react";
// import { useUser } from "@/context/UserContext";
// import { Button } from "../ui/button";
// import {
//   Menu,
//   X,
//   ChevronDown,
//   LogOut,
//   User,
//   LayoutDashboard,
//   Calendar,
//   Heart,
// } from "lucide-react"; // Added Heart icon
// import { usePathname, useRouter } from "next/navigation";
// import { logout } from "@/services/AuthService";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";
// import Link from "next/link";
// import { FaRegUserCircle, FaUserCircle } from "react-icons/fa";
// import { protectedRoutes } from "@/constants";
// import Image from "next/image";
// import logo from "@/app/favicon.ico";
// import { cn } from "@/lib/utils";
// import { motion, AnimatePresence } from "framer-motion";
// import { getAllSubjects } from "@/services/Subjects";
// import NavTutorFilters from "./NavTutorFilters";
// import { Badge } from "../ui/badge";
// import { getCart } from "@/services/CartService";

// interface Filters {
//   search: string;
//   subjects: string[];
//   rating: string;
//   hourlyRate: number;
//   availability: string;
//   location: string;
// }

// export default function Navbar() {
//   const { user, setIsLoading } = useUser();
//   const role = user?.role;
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isBrowseTutorsOpen, setIsBrowseTutorsOpen] = useState(false);
//   const [subjects, setSubjects] = useState<{ _id: string; name: string }[]>([]);
//   const [filters, setFilters] = useState<Filters>({
//     search: "",
//     subjects: [],
//     rating: "",
//     hourlyRate: 50,
//     availability: "",
//     location: "",
//   });
//   const [wishlistCount, setWishlistCount] = useState<number>(0);

//   const isActive = (path: string) => pathname === path;

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const handleLogout = () => {
//     logout();
//     setIsLoading(true);
//     if (protectedRoutes.some((route) => pathname.match(route))) {
//       router.push("/");
//     }
//   };

//   const handleSearch = () => {
//     const queryParams = new URLSearchParams();
//     if (filters.search) queryParams.append("search", filters.search);
//     if (filters.subjects.length > 0)
//       queryParams.append("subjects", filters.subjects.join(","));
//     if (filters.rating) queryParams.append("rating", filters.rating);
//     if (filters.hourlyRate)
//       queryParams.append("maxRate", filters.hourlyRate.toString());
//     if (filters.availability)
//       queryParams.append("availability", filters.availability);
//     if (filters.location) queryParams.append("location", filters.location);

//     router.push(`/tutors?${queryParams.toString()}`);
//     setIsBrowseTutorsOpen(false);
//   };

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const res = await getAllSubjects();
//         setSubjects(res.data);
//       } catch (error) {
//         console.error("Failed to fetch subjects:", error);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     setIsLoading(true);
//     setTimeout(() => {
//       setIsLoading(false);
//     }, 500);
//   }, [pathname, setIsLoading]);

//   useEffect(() => {
//     const fetchWishlistCount = async () => {
//       try {
//         const res = await getCart();
//         if (res?.success) {
//           const cartItems = res.data;
//           setWishlistCount(cartItems.length);
//         }
//       } catch (error) {
//         console.error("Error fetching wishlist count:", error);
//       }
//     };

//     fetchWishlistCount();

//     const handleCartUpdate = () => {
//       fetchWishlistCount();
//     };

//     window.addEventListener("cart-updated", handleCartUpdate);

//     return () => {
//       window.removeEventListener("cart-updated", handleCartUpdate);
//     };
//   }, []);

//   const navLinks = [
//     { name: "Home", href: "/", icon: null },
//     { name: "About", href: "/about", icon: null },
//     { name: "FAQ", href: "/faq", icon: null },
//     { name: "Blogs", href: "/blogs", icon: null },
//   ];

//   return (
//     <nav
//       className={cn(
//         "fixed w-full z-50 transition-all duration-300 border-b",
//         isScrolled
//           ? "bg-background/90 backdrop-blur-md shadow-sm border-border"
//           : "bg-background border-border"
//       )}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
//         <div className="flex justify-between h-16 items-center">
//           <div className="flex-shrink-0">
//             <Link href="/" className="flex items-center space-x-2 group">
//               <motion.div className="relative w-8 h-8">
//                 <Image
//                   src={logo}
//                   alt="TutorLink"
//                   width={32}
//                   height={32}
//                   className="rounded-lg"
//                 />
//               </motion.div>
//               <span className="text-xl font-bold">TutorLink</span>
//             </Link>
//           </div>

//           <div className="hidden md:flex items-center space-x-1">
//             <Link
//               href="/"
//               className={cn(
//                 "px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center space-x-1",
//                 isActive("/")
//                   ? "text-primary bg-primary/10"
//                   : "text-foreground/80 hover:text-primary hover:bg-primary/5"
//               )}
//             >
//               <span>Home</span>
//             </Link>

//             <DropdownMenu
//               open={isBrowseTutorsOpen}
//               onOpenChange={setIsBrowseTutorsOpen}
//             >
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className={cn(
//                     "px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center space-x-1",
//                     isActive("/tutors")
//                       ? "text-primary bg-primary/10"
//                       : "text-foreground/80 hover:text-primary hover:bg-primary/5"
//                   )}
//                 >
//                   <span>Browse Tutors</span>
//                   <ChevronDown className="h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent
//                 className="w-[600px] p-4 shadow-lg rounded-lg border border-border"
//                 align="start"
//                 sideOffset={10}
//               >
//                 <NavTutorFilters
//                   subjects={subjects}
//                   filters={filters}
//                   setFilters={setFilters}
//                   onSearch={handleSearch}
//                 />
//               </DropdownMenuContent>
//             </DropdownMenu>

//             {navLinks.slice(1).map((link) => (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 className={cn(
//                   "px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center space-x-1",
//                   isActive(link.href)
//                     ? "text-primary bg-primary/10"
//                     : "text-foreground/80 hover:text-primary hover:bg-primary/5"
//                 )}
//               >
//                 {link.icon && <span>{link.icon}</span>}
//                 <span>{link.name}</span>
//               </Link>
//             ))}
//           </div>

//           <div className="hidden md:flex items-center space-x-3">
//             {user ? (
//               <>
//                 {/* Wishlist Button with Badge */}
//                 {user.role === "student" && (
//                   <Link href="/wishlist">
//                     <div
//                       className="relative rounded-full hover:bg-primary/5  cursor-pointer"
//                       onClick={() => router.push("/wishlist")}
//                       aria-label="Wishlist"
//                     >
//                       <Heart className="h-5 w-5" />
//                       {wishlistCount > 0 && (
//                         <Badge
//                           variant="destructive"
//                           className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0"
//                         >
//                           {wishlistCount > 9 ? "9+" : wishlistCount}
//                         </Badge>
//                       )}
//                     </div>
//                   </Link>
//                 )}

//                 {/* Account Dropdown */}
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       className="flex items-center space-x-2 px-3 py-2 bg-primary/5 rounded-full"
//                     >
//                       <FaUserCircle className="h-4 w-4 text-primary" />
//                       <span className="text-sm font-medium text-foreground">
//                         Account
//                       </span>
//                       <ChevronDown className="h-4 w-4 text-muted-foreground" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent
//                     className="w-56 mt-2 shadow-lg rounded-md border border-border"
//                     align="end"
//                   >
//                     <DropdownMenuLabel className="font-normal">
//                       <div className="flex flex-col space-y-1">
//                         <p className="text-xs leading-none text-muted-foreground">
//                           {user.email}
//                         </p>
//                       </div>
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuGroup>
//                       <DropdownMenuItem asChild>
//                         <Link
//                           href={
//                             role === "tutor"
//                               ? "/tutor-profile"
//                               : "/student-profile"
//                           }
//                           className="w-full flex items-center"
//                         >
//                           <User className="mr-2 h-4 w-4" />
//                           <span>Profile</span>
//                         </Link>
//                       </DropdownMenuItem>
//                       <DropdownMenuItem asChild>
//                         <Link
//                           href={`/${role}/dashboard`}
//                           className="w-full flex items-center"
//                         >
//                           <LayoutDashboard className="mr-2 h-4 w-4" />
//                           <span>Dashboard</span>
//                         </Link>
//                       </DropdownMenuItem>
//                       <DropdownMenuItem asChild>
//                         <Link
//                           href={
//                             role === "student"
//                               ? "/booking/lists"
//                               : "/tutor/bookings"
//                           }
//                           className="w-full flex items-center"
//                         >
//                           <Calendar className="mr-2 h-4 w-4" />
//                           <span>Bookings</span>
//                         </Link>
//                       </DropdownMenuItem>
//                       {/* Added Wishlist to Dropdown */}
//                       {user.role === "student" && (
//                         <DropdownMenuItem asChild>
//                           <Link
//                             href="/wishlist"
//                             className="w-full flex items-center"
//                           >
//                             <Heart className="mr-2 h-4 w-4" />
//                             <span>Wishlist</span>
//                             {wishlistCount > 0 && (
//                               <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
//                                 {wishlistCount > 9 ? "9+" : wishlistCount}
//                               </span>
//                             )}
//                           </Link>
//                         </DropdownMenuItem>
//                       )}
//                     </DropdownMenuGroup>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem
//                       onClick={handleLogout}
//                       className="text-destructive focus:bg-destructive/10 focus:text-destructive"
//                     >
//                       <LogOut className="mr-2 h-4 w-4" />
//                       <span>Log out</span>
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </>
//             ) : (
//               <div className="flex space-x-2">
//                 <Button asChild variant="outline" className="rounded-full">
//                   <Link href="/register-student">Sign Up</Link>
//                 </Button>
//                 <Button
//                   asChild
//                   className="rounded-full bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90"
//                 >
//                   <Link href="/login">Login</Link>
//                 </Button>
//               </div>
//             )}
//           </div>

//           <div className="md:hidden flex items-center">
//             {user && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <FaRegUserCircle className="h-6 w-6 text-gray-800 mr-2" />
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent
//                   className="w-56 shadow-lg rounded-md border border-border"
//                   align="end"
//                   sideOffset={10}
//                 >
//                   <DropdownMenuLabel className="font-normal">
//                     <div className="flex flex-col space-y-1">
//                       <p className="text-xs leading-none text-muted-foreground">
//                         {user.email}
//                       </p>
//                     </div>
//                   </DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuGroup>
//                     <DropdownMenuItem asChild>
//                       <Link
//                         href={
//                           role === "tutor"
//                             ? "/tutor-profile"
//                             : "/student-profile"
//                         }
//                         className="w-full flex items-center"
//                       >
//                         <User className="mr-2 h-4 w-4" />
//                         <span>Profile</span>
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem asChild>
//                       <Link
//                         href={`/${role}/dashboard`}
//                         className="w-full flex items-center"
//                       >
//                         <LayoutDashboard className="mr-2 h-4 w-4" />
//                         <span>Dashboard</span>
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem asChild>
//                       <Link
//                         href={
//                           role === "student"
//                             ? "/booking/lists"
//                             : "/tutor/bookings"
//                         }
//                         className="w-full flex items-center"
//                       >
//                         <Calendar className="mr-2 h-4 w-4" />
//                         <span>Bookings</span>
//                       </Link>
//                     </DropdownMenuItem>
//                     {/* Added Wishlist to Mobile Dropdown */}
//                     <DropdownMenuItem asChild>
//                       <Link
//                         href="/wishlist"
//                         className="w-full flex items-center"
//                       >
//                         <Heart className="mr-2 h-4 w-4" />
//                         <span>Wishlist</span>
//                         {wishlistCount > 0 && (
//                           <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
//                             {wishlistCount > 9 ? "9+" : wishlistCount}
//                           </span>
//                         )}
//                       </Link>
//                     </DropdownMenuItem>
//                   </DropdownMenuGroup>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem
//                     onClick={handleLogout}
//                     className="text-destructive focus:bg-destructive/10 focus:text-destructive"
//                   >
//                     <LogOut className="mr-2 h-4 w-4" />
//                     <span>Log out</span>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//             <div
//               onClick={toggleMobileMenu}
//               aria-label="Toggle mobile menu"
//               className="flex items-center justify-center rounded-full hover:bg-primary/5 h-12 w-12 cursor-pointer"
//             >
//               {isMobileMenuOpen ? (
//                 <X className="h-6 w-6 text-foreground" />
//               ) : (
//                 <Menu className="h-6 w-6 text-foreground" />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.2 }}
//             className="md:hidden bg-background border-t border-border overflow-hidden"
//           >
//             <div className="px-4 py-3 space-y-2">
//               <Link
//                 href="/"
//                 onClick={toggleMobileMenu}
//                 className={cn(
//                   "block px-3 py-2 rounded-md text-base font-medium transition-colors",
//                   isActive("/")
//                     ? "bg-primary/10 text-primary"
//                     : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
//                 )}
//               >
//                 Home
//               </Link>
//               <Link
//                 href="/tutors"
//                 onClick={toggleMobileMenu}
//                 className={cn(
//                   "block px-3 py-2 rounded-md text-base font-medium transition-colors",
//                   isActive("/tutors")
//                     ? "bg-primary/10 text-primary"
//                     : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
//                 )}
//               >
//                 Browse Tutors
//               </Link>
//               {navLinks.slice(1).map((link) => (
//                 <Link
//                   key={link.name}
//                   href={link.href}
//                   onClick={toggleMobileMenu}
//                   className={cn(
//                     "block px-3 py-2 rounded-md text-base font-medium transition-colors",
//                     isActive(link.href)
//                       ? "bg-primary/10 text-primary"
//                       : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
//                   )}
//                 >
//                   {link.name}
//                 </Link>
//               ))}

//               {!user && (
//                 <div className="pt-2 border-t border-border space-y-2">
//                   <Button asChild variant="outline" className="w-full">
//                     <Link href="/register-student" onClick={toggleMobileMenu}>
//                       Sign Up
//                     </Link>
//                   </Button>
//                   <Button
//                     asChild
//                     className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90"
//                   >
//                     <Link href="/login" onClick={toggleMobileMenu}>
//                       Login
//                     </Link>
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// }
