// components/modules/Profile/Profile.tsx
import { formatToMalaysiaTime } from "@/utils/formatDate";
import type { TMe } from "@/services/Profile";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  User2,
  Mail,
  Shield,
  Activity,
  Clock,
  CalendarDays,
  BadgeCheck,
  Pencil,
} from "lucide-react";
import * as React from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

type ProfileProps = { me: TMe };

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

export default function Profile({ me }: ProfileProps) {
  const createdPretty = formatToMalaysiaTime(me.createdAt, "dd MMM yyyy");
  const statusClass =
    statusPill[me.status?.toLowerCase()] ?? statusPill.inactive;

  return (
    <div className="w-full">
      <Card className="w-full overflow-hidden border-neutral-200 dark:border-white/10 bg-white/90 dark:bg-black/30 backdrop-blur">
        {/* Header */}
        <CardHeader className="p-6 sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr_auto] gap-6 items-center">
              {/* Big Avatar */}
              <div className="flex items-center justify-center">
                <div className="h-[120px] w-[120px] sm:h-[160px] sm:w-[160px] rounded-full border border-neutral-200 dark:border-neutral-700 shadow-md bg-gradient-to-br from-white/70 to-white/30 dark:from-white/10 dark:to-white/5 flex items-center justify-center">
                  <Avatar className="h-[88%] w-[88%] rounded-full bg-transparent">
                    <AvatarFallback className="h-full w-full rounded-full text-4xl sm:text-5xl font-bold bg-transparent">
                      {initialsOf(me.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Main identity */}
              <div className="min-w-0 space-y-2">
                <h2 className="truncate capitalize text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-white">
                  {me.name}
                </h2>

                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 text-gray-700 dark:text-gray-300">
                    <Mail className="h-4 w-4" />
                    <span className="truncate" title={me.email}>
                      {me.email}
                    </span>
                  </span>

                  <Separator orientation="vertical" className="h-4 mx-1" />

                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Shield className="h-3.5 w-3.5" />
                    {nice(me.role)}
                  </Badge>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusClass}`}
                  >
                    {nice(me.status)}
                    {me.status?.toLowerCase() === "active" ? (
                      <BadgeCheck className="h-3.5 w-3.5" />
                    ) : null}
                  </span>
                </div>
              </div>

              {/* Edit button */}
              <div className="flex items-start sm:items-center justify-start sm:justify-end gap-2">
                <Link href={`/${me.role}/profile/${me._id}/edit`}>
                  <Button size="sm" variant="outline">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardHeader>

        <Separator className="opacity-60" />

        {/* Cards grid */}
        <CardContent className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <InfoCard
              label="Full Name"
              value={me.name}
              icon={<User2 className="h-5 w-5" />}
              iconClass="text-blue-400"
            />
            <InfoCard
              label="Email"
              value={
                <span className="truncate block" title={me.email}>
                  {me.email}
                </span>
              }
              icon={<Mail className="h-5 w-5" />}
              iconClass="text-indigo-400"
            />
            <InfoCard
              label="Role"
              value={nice(me.role)}
              icon={<Shield className="h-5 w-5" />}
              iconClass="text-orange-400"
            />
            <InfoCard
              label="Status"
              value={
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}
                >
                  {nice(me.status)}
                </span>
              }
              icon={<Activity className="h-5 w-5" />}
              iconClass="text-red-400"
            />
            <InfoCard
              label="Member Since"
              value={<div className="font-semibold">{createdPretty}</div>}
              icon={<CalendarDays className="h-5 w-5" />}
              iconClass="text-yellow-400"
            />
            <InfoCard
              label="Time Spent"
              value={me.timeSpent ?? 0}
              icon={<Clock className="h-5 w-5" />}
              iconClass="text-cyan-400"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/** Reusable info card */
function InfoCard({
  label,
  value,
  hint,
  icon,
  iconClass,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  iconClass?: string;
}) {
  return (
    <div className="rounded-lg p-4 shadow-sm flex items-start gap-4 border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700">
      <div className={`mt-1 ${iconClass ?? ""}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="font-medium text-[15px] break-words">{value}</div>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </div>
  );
}
