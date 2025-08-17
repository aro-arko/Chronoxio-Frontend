"use server";

import { cookies } from "next/headers";

export const allUsers = async () => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/users/all`,
      {
        headers: { Authorization: `${token}` },
        // cache: "no-store", // uncomment if you want no caching
      }
    );
    if (!response.ok) throw new Error("Failed to load users");
    return response.json(); // { success, message, statusCode, data: [...] }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch users");
  }
};

// Toggle/Update user status
export const updateUserStatus = async (userId: string, status: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/users/deactivate/${userId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `Failed to update status: ${response.status} ${response.statusText} ${body}`
      );
    }
    return response.json();
  } catch (error) {
    console.log(error);
    throw new Error("Admin users cannot be deactivated");
  }
};
