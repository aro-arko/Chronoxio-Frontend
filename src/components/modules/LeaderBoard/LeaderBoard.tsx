/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Search, X, Users, Clock } from "lucide-react";

type LeaderboardRow = {
  serialNo: number;
  _id: string;
  name: string;
  timeSpent: number;
};

type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  sortedBy: string;
  sortOrder: "asc" | "desc";
  search?: string;
};

type Props = {
  initialRows: LeaderboardRow[];
  initialMeta: Meta;
};

const pageNumbers = (current: number, total: number) => {
  const nums: (number | "…")[] = [];
  const window = 1;
  const add = (n: number | "…") => nums[nums.length - 1] !== n && nums.push(n);
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - current) <= window) add(i);
    else if (nums[nums.length - 1] !== "…") add("…");
  }
  return nums;
};

const initials = (name: string) =>
  name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("") || "U";

const LeaderBoard = ({ initialRows, initialMeta }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // local mirrors for inputs
  const [searchInput, setSearchInput] = useState(initialMeta.search ?? "");
  const [limit, setLimit] = useState(initialMeta.limit);

  // sync when URL changes from outside
  useEffect(() => {
    setSearchInput(initialMeta.search ?? "");
    setLimit(initialMeta.limit);
  }, [initialMeta.search, initialMeta.limit]);

  const rows = initialRows;
  const meta = initialMeta;

  const updateQuery = (
    partial: Record<string, string | number | undefined>
  ) => {
    const p = new URLSearchParams(searchParams?.toString() ?? "");
    // keep default sort consistent
    p.set("sortBy", "timeSpent");
    p.set("sortOrder", "desc");

    Object.entries(partial).forEach(([k, v]) => {
      if (v === undefined || v === null || String(v).trim() === "") p.delete(k);
      else p.set(k, String(v));
    });

    startTransition(() => {
      router.push(`${pathname}?${p.toString()}`, { scroll: false });
    });
  };

  // debounce search -> URL
  useEffect(() => {
    const id = setTimeout(() => {
      updateQuery({ page: 1, search: searchInput || undefined });
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const totalPages = meta.totalPages ?? 1;
  const currentPage = meta.page ?? 1;
  const loading = isPending;

  const start = meta.total ? (meta.page - 1) * meta.limit + 1 : 0;
  const end = meta.total ? Math.min(meta.total, start + rows.length - 1) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            <Trophy className="h-6 w-6 text-amber-500" aria-hidden />
            <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3.5 w-3.5" />
              Sorted by most time spent (Self Improvement)
            </Badge>
            <Badge className="gap-1">
              <Users className="h-3.5 w-3.5" />
              {meta.total} user{meta.total === 1 ? "" : "s"}
            </Badge>
            {meta.total > 0 && (
              <Badge variant="outline">
                Showing {start}–{end}
              </Badge>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-8 pr-8"
            />
            {searchInput && (
              <button
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:bg-muted"
                onClick={() => setSearchInput("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Select
            value={String(limit)}
            onValueChange={(val) => {
              const next = Number(val) || 10;
              setLimit(next);
              updateQuery({ page: 1, limit: next });
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Rows/page" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}/page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {loading &&
          Array.from({ length: meta.limit }).map((_, i) => (
            <Card key={`cs-${i}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-10" />
                </div>
              </CardContent>
            </Card>
          ))}

        {!loading && rows.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              No users found
            </CardContent>
          </Card>
        )}

        {!loading &&
          rows.map((u) => (
            <Card key={u._id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{initials(u.name)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{u.name}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>timeSpent: {u.timeSpent}</span>
                    </div>
                  </div>
                  <Badge className="rounded-full px-2 py-1 text-xs">
                    {u.serialNo}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border md:block">
        <table className="min-w-full divide-y">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Rank</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Time Spent
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading &&
              Array.from({ length: meta.limit }).map((_, i) => (
                <tr key={`s-${i}`}>
                  <td className="px-4 py-3">
                    <Skeleton className="h-5 w-10" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-5 w-24" />
                  </td>
                </tr>
              ))}

            {!loading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  No users found
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((u) => (
                <tr key={u._id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 text-sm font-semibold">
                    #{u.serialNo}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{initials(u.name)}</AvatarFallback>
                      </Avatar>
                      <span>{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{u.timeSpent}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Showing page <span className="font-medium">{meta.page}</span> of{" "}
          <span className="font-medium">{meta.totalPages}</span> —{" "}
          <span className="font-medium">{meta.total}</span> user
          {meta.total === 1 ? "" : "s"}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateQuery({ page: Math.max(1, meta.page - 1) })}
            disabled={meta.page <= 1 || loading}
          >
            Prev
          </Button>

          {pageNumbers(meta.page, meta.totalPages).map((n, idx) =>
            n === "…" ? (
              <span
                key={`e-${idx}`}
                className="px-2 text-sm text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Button
                key={n}
                variant={n === meta.page ? "default" : "outline"}
                size="sm"
                onClick={() => updateQuery({ page: n as number })}
                disabled={loading}
              >
                {n}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateQuery({ page: Math.min(meta.totalPages, meta.page + 1) })
            }
            disabled={meta.page >= meta.totalPages || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
