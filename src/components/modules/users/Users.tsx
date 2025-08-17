/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Loader2, Users as UsersIcon, Mail, User2 } from "lucide-react";
import { updateUserStatus } from "@/services/UserService";

type TUser = {
  _id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "suspended" | string;
};

export default function Users({ initialUsers }: { initialUsers: TUser[] }) {
  const [users, setUsers] = React.useState<TUser[]>(initialUsers || []);
  const [filter, setFilter] = React.useState("");
  const [pendingIds, setPendingIds] = React.useState<Record<string, boolean>>(
    {}
  );

  const filtered = React.useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q)
    );
  }, [users, filter]);

  function initialsOf(name: string) {
    return (name || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("");
  }

  const statusBadge = (s: string) => {
    const m = s?.toLowerCase();
    if (m === "active") return "bg-green-100 text-green-700";
    if (m === "suspended") return "bg-rose-100 text-rose-700";
    return "bg-gray-100 text-gray-700";
  };

  const boolFromStatus = (s: string) => s?.toLowerCase() === "active";
  const statusFromBool = (on: boolean) => (on ? "active" : "inactive");

  const onToggle = async (user: TUser, nextOn: boolean) => {
    // Optimistic UI
    setPendingIds((p) => ({ ...p, [user._id]: true }));
    const prev = users;

    const nextStatus = statusFromBool(nextOn);
    setUsers((u) =>
      u.map((x) => (x._id === user._id ? { ...x, status: nextStatus } : x))
    );

    try {
      await updateUserStatus(user._id, nextStatus);
      toast.success("Status updated", {
        description: `${user.name} is now ${nextStatus}.`,
      });
    } catch (e: any) {
      // revert
      setUsers(prev);
      toast.error("Failed to update status", {
        description: e?.message ?? "Please try again.",
      });
    } finally {
      setPendingIds((p) => ({ ...p, [user._id]: false }));
    }
  };

  return (
    <div className="w-full">
      {/* Header / Toolbar */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <UsersIcon className="h-5 w-5" />
          <h1 className="text-xl font-semibold tracking-tight">Users</h1>
          <Badge variant="secondary" className="ml-1">
            {users.length}
          </Badge>
        </div>
        <div className="sm:ml-auto w-full sm:w-80">
          <Input
            placeholder="Search name, email, status…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[72px]">User</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => {
                const isPending = !!pendingIds[u._id];
                const isSuspended = u.status?.toLowerCase() === "suspended";
                const isOn = boolFromStatus(u.status);

                return (
                  <TableRow key={u._id} className="align-middle">
                    <TableCell>
                      <Avatar className="h-9 w-9 rounded-lg">
                        <AvatarFallback className="rounded-lg">
                          {initialsOf(u.name)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User2 className="h-4 w-4 text-muted-foreground" />
                        <span>{u.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{u.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(
                          u.status
                        )}`}
                      >
                        {u.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="inline-flex items-center gap-2">
                        {isPending && (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                        <Switch
                          checked={isOn}
                          disabled={isPending || isSuspended}
                          onCheckedChange={(on) => onToggle(u, on)}
                          aria-label={`Toggle active status for ${u.name}`}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
