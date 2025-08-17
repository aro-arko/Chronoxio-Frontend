// app/(WithDashboardLayout)/admin/leaderboard/page.tsx
import LeaderBoard from "@/components/modules/LeaderBoard/LeaderBoard";
import { getLeaderBoard } from "@/services/LeaderBoard";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "View the leaderboard for user performance",
};

type SP = Record<string, string | string[] | undefined>;

const getStr = (sp: SP, key: string, fallback = ""): string => {
  const v = sp?.[key];
  return (Array.isArray(v) ? v[0] : v) ?? fallback;
};

const buildQueryFromSearchParams = (sp: SP = {}) => {
  const p = new URLSearchParams();

  const page = getStr(sp, "page", "1");
  const limit = getStr(sp, "limit", "10");
  const sortBy = getStr(sp, "sortBy", "timeSpent");
  const sortOrder = getStr(sp, "sortOrder", "desc");
  const search = getStr(sp, "search", "").trim();

  p.set("page", page);
  p.set("limit", limit);
  p.set("sortBy", sortBy);
  p.set("sortOrder", sortOrder);
  if (search) p.set("search", search);

  return p.toString();
};

export default async function LeaderBoardPage({
  // IMPORTANT: accept Promise<SP> because .next/types for this route expects it
  searchParams,
}: {
  searchParams?: Promise<SP>;
}) {
  // Works whether it's a Promise or already resolved (await handles both at runtime)
  const sp = (await searchParams) ?? {};

  const query = buildQueryFromSearchParams(sp);
  const payload = await getLeaderBoard(query);

  const meta = payload?.data?.meta ?? {
    page: Number(getStr(sp, "page", "1")),
    limit: Number(getStr(sp, "limit", "10")),
    total: 0,
    totalPages: 1,
    sortedBy: getStr(sp, "sortBy", "timeSpent"),
    sortOrder: getStr(sp, "sortOrder", "desc") as "asc" | "desc",
    search: getStr(sp, "search", ""),
  };

  const rows = payload?.data?.data ?? [];

  return (
    <div className="p-4 sm:p-6">
      <LeaderBoard initialRows={rows} initialMeta={meta} />
    </div>
  );
}
