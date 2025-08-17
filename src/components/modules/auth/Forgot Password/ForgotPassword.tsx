/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

import { forgotPassword } from "@/services/AuthService";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPassword() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const {
    formState: { isSubmitting },
  } = form;

  // Success UI state
  const [sentTo, setSentTo] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await forgotPassword(data.email as string);

      if (res?.success) {
        toast.success(res?.message || "Password reset email sent.");
        setSentTo(String(data.email));
      } else {
        toast.error(res?.message || "Failed to send reset email.");
      }
    } catch (e: any) {
      toast.error(e?.message || "Something went wrong.");
    }
  };

  return (
    <section
      className={`min-h-screen flex items-center justify-center px-4 py-16 transition-colors duration-500`}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-lg rounded-xl shadow-md p-6 backdrop-blur-lg border bg-white/90 dark:bg-white/5 dark:text-white"
      >
        {!sentTo ? (
          <>
            <h1 className="text-3xl font-bold text-center mb-2">
              Forgot Password
            </h1>
            <p className="text-center text-sm text-neutral-700 dark:text-neutral-300 mb-8">
              Enter your email and we’ll send you a secure link to reset your
              password.
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="you@example.com"
                          className="bg-transparent"
                          autoComplete="email"
                          inputMode="email"
                        />
                      </FormControl>
                      <FormMessage className="text-blue-500 text-sm" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send reset link"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Remembeblue your password?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Back to login
                </Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-3">
              Check your inbox ✉️
            </h1>
            <p className="text-center text-sm text-neutral-700 dark:text-neutral-300 mb-6">
              We sent a password reset link to{" "}
              <span className="font-semibold">{sentTo}</span>. The link will
              expire shortly for security reasons.
            </p>

            <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
              <p>Didn’t get the email?</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Check your spam or junk folder.</li>
                <li>Verify you enteblue the correct email address.</li>
                <li>Try sending the request again in a few minutes.</li>
              </ul>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white/10 dark:hover:bg-white/20"
                onClick={() => router.push("/login")}
              >
                Back to login
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSentTo(null)}
              >
                Use a different email
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
}
