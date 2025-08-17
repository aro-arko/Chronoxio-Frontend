/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
} from "lucide-react";
import { changePassword } from "@/services/AuthService";

const schema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((v) => v.newPassword === v.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

export default function ChangePassword() {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [show, setShow] = React.useState({
    old: false,
    next: false,
    confirm: false,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: FormData) => {
    try {
      setSaving(true);

      // send exactly { oldPassword, newPassword }
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      toast.success("Password changed", {
        description: "Your password has been updated successfully.",
        duration: 3000,
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });

      form.reset();
      router.push("/admin/profile");
    } catch (e: any) {
      toast.error("Change failed", {
        description: e?.message ?? "Please try again.",
        duration: 4000,
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    // Center the card on the page
    <div className="min-h-screen grid place-items-center px-4 py-6">
      <Card className="w-full max-w-xl overflow-hidden border-neutral-200 dark:border-white/10 bg-white/90 dark:bg-black/30 backdrop-blur mx-auto">
        {/* Header */}
        <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="text-base sm:text-lg font-semibold">
              Change Password
            </div>
            <div className="w-[72px]" />
          </div>
        </CardHeader>

        <Separator className="opacity-60" />

        <CardContent className="px-4 py-5 sm:px-6 sm:py-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Current password */}
            <div className="space-y-1.5">
              <Label htmlFor="oldPassword" className="flex items-center gap-2">
                <LockKeyhole className="h-4 w-4" />
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={show.old ? "text" : "password"}
                  autoComplete="current-password"
                  {...form.register("oldPassword")}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                  onClick={() => setShow((s) => ({ ...s, old: !s.old }))}
                  aria-label={show.old ? "Hide password" : "Show password"}
                >
                  {show.old ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {form.formState.errors.oldPassword && (
                <p className="text-xs text-red-600 mt-1">
                  {form.formState.errors.oldPassword.message}
                </p>
              )}
            </div>

            {/* New password */}
            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={show.next ? "text" : "password"}
                  autoComplete="new-password"
                  {...form.register("newPassword")}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                  onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
                  aria-label={show.next ? "Hide password" : "Show password"}
                >
                  {show.next ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {form.formState.errors.newPassword && (
                <p className="text-xs text-red-600 mt-1">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
              <p className="text-[11px] text-muted-foreground">
                Minimum 8 characters recommended.
              </p>
            </div>

            {/* Confirm new password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="confirmNewPassword"
                className="flex items-center gap-2"
              >
                <KeyRound className="h-4 w-4" />
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmNewPassword"
                  type={show.confirm ? "text" : "password"}
                  autoComplete="new-password"
                  {...form.register("confirmNewPassword")}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                  onClick={() =>
                    setShow((s) => ({ ...s, confirm: !s.confirm }))
                  }
                  aria-label={show.confirm ? "Hide password" : "Show password"}
                >
                  {show.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {form.formState.errors.confirmNewPassword && (
                <p className="text-xs text-red-600 mt-1">
                  {form.formState.errors.confirmNewPassword.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/profile")}
                size="sm"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? "Saving..." : "Change Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
