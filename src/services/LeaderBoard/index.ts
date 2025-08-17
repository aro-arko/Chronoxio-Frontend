"use server";

import { cookies } from "next/headers";

export const getLeaderBoard = async (query: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/users/leaderboard?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return await res.json();
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
};
