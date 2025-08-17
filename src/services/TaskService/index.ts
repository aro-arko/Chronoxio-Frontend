/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { FieldValues } from "react-hook-form";
import { cookies } from "next/headers";

export const createTask = async (taskData: FieldValues) => {
  console.log(taskData);
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/tasks/create`,
      {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      }
    );
    console.log(res);

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// complete task
export const completeTask = async (
  taskId: string,
  data: { timeSpent: number }
) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/tasks/complete/${taskId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const getTasks = async () => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) throw new Error("No access token found");

  const params = new URLSearchParams();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/tasks?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch tasks: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("getTasks error:", error);
    throw error;
  }
};

export const getTasksForDashboard = async () => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) throw new Error("No access token found");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch tasks: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json?.data ?? [];
};

// export const deleteTask = async(task)
export const deleteTask = async (taskId: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/tasks/delete/${taskId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error(
        `Completed tasks can only be deleted after 7 days for reporting purposes`
      );
    }

    return res.json();
  } catch (error) {
    console.error("deleteTask error:", error);
    throw error;
  }
};

// get weekly report
export const getWeeklyReport = async () => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/tasks/report/weekly`,
      {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const json = await res.json();
    return json.data ?? []; // 👈 only return the array
  } catch (error) {
    console.error("getWeeklyReport error:", error);
    throw error;
  }
};

// update task - expired
export const updateExpiredTask = async (taskId: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/tasks/update/${taskId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "expired" }),
      }
    );

    return res.json();
  } catch (error) {
    console.error("updateExpiredTask error:", error);
    throw error;
  }
};
