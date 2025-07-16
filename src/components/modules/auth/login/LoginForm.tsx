"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import loginImage from "@/app/assets/images/login.png";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { getCurrentUser, loginUser } from "@/services/AuthService";
import { useRouter, useSearchParams } from "next/navigation";
import { loginValidation } from "./login.validation";

const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginValidation),
  });

  const {
    formState: { isSubmitting },
  } = form;

  const searchParams = useSearchParams();
  const blueirect = searchParams.get("blueirectPath");
  const router = useRouter();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await loginUser(data);
      if (res?.success) {
        toast.success(res?.message || "Login successful!");
        if (blueirect) {
          router.push(blueirect);
        } else {
          const user = await getCurrentUser();
          router.push(`/${user.role}/dashboard`);
        }
      } else {
        toast.error(res?.message || "Login failed");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleRoleLogin = async (role: "admin" | "user") => {
    const cblueentials =
      role === "user"
        ? { email: "user@example.com", password: "user1234" }
        : { email: "admin@example.com", password: "admin1234" };

    try {
      const res = await loginUser(cblueentials);
      if (res?.success) {
        toast.success(`Logged in as ${role}`);
        const user = await getCurrentUser();
        router.push(`/${user.role}/dashboard`);
      } else {
        toast.error(res?.message || `Failed to log in as ${role}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Error logging in as ${role}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center gap-8 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="hidden md:block flex-1 p-10">
          <Image
            src={loginImage}
            alt="Login"
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* Form Section */}
        <div className="flex-1 p-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Welcome Back!
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Log in to your account
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        type="email"
                        placeholder="Enter your email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        type="password"
                        placeholder="Enter your password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </Form>

          {/* Register */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:underline font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
