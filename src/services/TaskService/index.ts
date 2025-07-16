"use server";

import { FieldValues } from "react-hook-form";
import { cookies } from "next/headers";

// helper to build headers
const getAuthHeaders = async () => {
  const token = (await cookies()).get("accessToken")?.value;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `${token}` }), // no Bearer prefix
  };
};

export const createTask = async (taskData: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/tasks/create`,
      {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify(taskData),
      }
    );

    return res.json();
  } catch (error: unknown) {
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

export const getIncompletedTasks = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/tasks?status=in-complete`,
      {
        method: "GET",
        headers: await getAuthHeaders(),
      }
    );
    return res.json();
  } catch (error: unknown) {
    return Error(error);
  }
};

export const getCompletedTasks = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/tasks?status=completed`,
      {
        method: "GET",
        headers: await getAuthHeaders(),
      }
    );
    return res.json();
  } catch (error: unknown) {
    return Error(error);
  }
};

// update task status
export const updateTaskStatus = async (taskId: string, data: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/tasks/update/${taskId}`,
      {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ taskId, ...data }),
      }
    );
    return res.json();
  } catch (error: unknown) {
    return Error(error);
  }
};

// get pending tasks
export const getPendingTasks = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/tasks?status=in-complete`,
      {
        method: "GET",
        headers: await getAuthHeaders(),
      }
    );
    return res.json();
  } catch (error: unknown) {
    return Error(error);
  }
};
