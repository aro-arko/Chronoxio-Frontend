// services/Profile.ts
"use server";

import { cookies } from "next/headers";

export type TMe = {
  _id: string;
  data: TMe;
  name: string;
  email: string;
  role: string;
  timeSpent: number;
  status: string;
  createdAt: string; // ISO string or epoch you already return
};

export const getMe = async (): Promise<TMe> => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `${token}`, // you said this is correct for your API
      },
      cache: "no-store", // avoids stale data during dev
    });

    // Optional: throw on non-OK to surface issues clearly
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`getMe failed: ${res.status} ${res.statusText} ${body}`);
    }

    return res.json();
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch user data");
  }
};

// update profile

export const updateProfile = async (data: Record<string, unknown>) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/users/update/me`,
      {
        method: "PATCH",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `updateProfile failed: ${res.status} ${res.statusText} ${body}`
      );
    }

    return res.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update user data");
  }
};
