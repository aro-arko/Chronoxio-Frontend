/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";
import { jwtDecode } from "jwt-decode";

export const registerUser = async (tutorData: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tutorData),
      }
    );
    return res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Error(error);
  }
};
export const loginUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const result = await res.json();

    if (result.success) {
      (await cookies()).set("accessToken", result.data);
    }
    return result;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Error(error);
  }
};

export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  let decodedData = null;

  if (accessToken) {
    decodedData = await jwtDecode(accessToken);
    return decodedData;
  }
};

export async function changePassword(payload: {
  oldPassword: string;
  newPassword: string;
}) {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/auth/change-password`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(payload), // 👈 exactly { oldPassword, newPassword }
      cache: "no-store",
    }
  );

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && data.message) ||
      `Change password failed: ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return data; // { success, message, ... } (depends on your API)
}

export const logout = async () => {
  (await cookies()).delete("accessToken");
};
