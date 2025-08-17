/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { updateProfile } from "@/services/Profile";
import { formatToMalaysiaTime } from "@/utils/formatDate";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  User2,
  Mail,
  Shield,
  Activity,
  Clock,
  CalendarDays,
  BadgeCheck,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner"; // ✅ sonner

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
});

type FormData = z.infer<typeof schema>;

const statusPill: Record<string, string> = {
  active:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
  suspended: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

function initialsOf(name: string) {
  return (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

const nice = (s: string) =>
  s?.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

export default function EditProfile({ me }: { me: any }) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: me?.name ?? "",
      email: me?.email ?? "",
    },
  });

  const createdPretty = formatToMalaysiaTime(me?.createdAt, "dd MMM yyyy");
  const createdFull = formatToMalaysiaTime(
    me?.createdAt,
    "dd MMM yyyy, hh:mm a"
  );
  const statusClass =
    statusPill[me?.status?.toLowerCase()] ?? statusPill.inactive;

  const onSubmit = async (values: FormData) => {
    try {
      setSaving(true);
      await updateProfile(values);

      // ✅ Sonner success toast
      toast.success("Profile updated", {
        description: "Your profile has been saved successfully.",
        duration: 3000,
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });

      router.push(`/${me.role}/profile`);
    } catch (e: any) {
      const message = e?.message ?? "Failed to update profile";
      // ✅ Sonner error toast
      toast.error("Update failed", {
        description: message,
        duration: 4000,
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full overflow-hidden border-neutral-200 dark:border-white/10 bg-white/90 dark:bg-black/30 backdrop-blur">
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
                Edit Profile
              </div>
              <div className="w-[72px]" />
            </div>
          </CardHeader>

          <Separator className="opacity-60" />

          {/* Identity block */}
          <CardHeader className="px-4 py-5 sm:px-6 sm:py-6">
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4 items-center">
              <div className="flex items-center justify-center">
                <div className="h-[90px] w-[90px] sm:h-[120px] sm:w-[120px] rounded-full border border-neutral-200 dark:border-neutral-700 shadow bg-gradient-to-br from-white/70 to-white/30 dark:from-white/10 dark:to-white/5 flex items-center justify-center">
                  <Avatar className="h-[85%] w-[85%] rounded-full bg-transparent">
                    <AvatarFallback className="h-full w-full rounded-full text-2xl sm:text-3xl font-bold bg-transparent">
                      {initialsOf(me?.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <div className="min-w-0 space-y-1.5">
                <h2 className="truncate capitalize text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white">
                  {me?.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                  <span className="inline-flex items-center gap-1 text-gray-700 dark:text-gray-300">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate" title={me?.email}>
                      {me?.email}
                    </span>
                  </span>
                  <Separator orientation="vertical" className="h-3 mx-1" />
                  <Badge variant="secondary" className="gap-1 text-[11px]">
                    <Shield className="h-3 w-3" />
                    {nice(me?.role)}
                  </Badge>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClass}`}
                  >
                    {nice(me?.status)}
                    {me?.status?.toLowerCase() === "active" ? (
                      <BadgeCheck className="h-3 w-3" />
                    ) : null}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <Separator className="opacity-60" />

          {/* Grid of cards (only Name & Email are editable) */}
          <CardContent className="px-4 py-5 sm:px-6 sm:py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {/* Editable Name */}
              <EditCard
                label="Full Name"
                icon={<User2 className="h-4 w-4" />}
                iconClass="text-blue-400"
              >
                <Input id="name" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-xs text-red-600 mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </EditCard>

              {/* Editable Email */}
              <EditCard
                label="Email"
                icon={<Mail className="h-4 w-4" />}
                iconClass="text-indigo-400"
              >
                <Input id="email" type="email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-600 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </EditCard>

              {/* Read-only Role */}
              <ReadOnlyCard
                label="Role"
                value={nice(me?.role)}
                icon={<Shield className="h-4 w-4" />}
                iconClass="text-orange-400"
              />

              {/* Read-only Status */}
              <ReadOnlyCard
                label="Status"
                value={
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClass}`}
                  >
                    {nice(me?.status)}
                  </span>
                }
                icon={<Activity className="h-4 w-4" />}
                iconClass="text-red-400"
              />

              {/* Read-only Member Since */}
              <ReadOnlyCard
                label="Member Since"
                value={
                  <div>
                    <div className="font-semibold text-sm">{createdPretty}</div>
                    <div className="text-xs text-muted-foreground">
                      {createdFull}
                    </div>
                  </div>
                }
                icon={<CalendarDays className="h-4 w-4" />}
                iconClass="text-yellow-400"
              />

              {/* Read-only Time Spent */}
              <ReadOnlyCard
                label="Time Spent"
                value={me?.timeSpent ?? 0}
                icon={<Clock className="h-4 w-4" />}
                iconClass="text-cyan-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sticky actions */}
        <div className="sticky bottom-0 left-0 right-0 mt-4 bg-gradient-to-t from-white/90 to-white/40 dark:from-black/80 dark:to-black/20 backdrop-blur border-t border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-6xl px-3 py-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => router.push("/admin/profile")}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

/** Editable card */
function EditCard({
  label,
  icon,
  iconClass,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  iconClass?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md p-3 shadow-sm flex items-start gap-3 border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700">
      <div className={`mt-0.5 ${iconClass ?? ""}`}>{icon}</div>
      <div className="min-w-0 w-full">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}

/** Read-only card */
function ReadOnlyCard({
  label,
  value,
  icon,
  iconClass,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  iconClass?: string;
}) {
  return (
    <div className="rounded-md p-3 shadow-sm flex items-start gap-3 border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700">
      <div className={`mt-0.5 ${iconClass ?? ""}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="font-medium text-sm break-words">{value}</div>
      </div>
    </div>
  );
}
