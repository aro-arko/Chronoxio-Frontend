"use client";

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getTasks } from "@/services/TaskService";
import AllTasksPage from "@/app/(WithDashboardLayout)/user/alltasks/page";

const UserDashboard = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks();
        // console.log(res);
        if (res.success) {
          setTasks(res.data);
        } else {
          console.error("Failed to fetch tasks:", res.message);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);
  console.log(tasks);

  return (
    <div className="px-4 space-y-6">
      <div className="mb-10 text-center">
        {loading ? (
          <>
            <Skeleton className="h-10 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-black mb-2">
              Welcome to your Dashboard! 👋
            </h1>
            <p className="text-gray-700 text-base">
              This is your User Dashboard. Here you can view your tasks, update
              your profile, and manage your account — all in one place.
            </p>
          </>
        )}
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-blue-50 border border-blue-100 h-[300px] flex items-center justify-center text-gray-600">
          {loading ? (
            <Skeleton className="h-6 w-40" />
          ) : (
            <p>Your Tasks will appear here</p>
          )}
        </div>

        <div className="rounded-xl bg-blue-50 border border-blue-100 h-[300px] flex items-center justify-center text-gray-600">
          {loading ? (
            <Skeleton className="h-6 w-40" />
          ) : (
            <p>Your Profile Info</p>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 max-h-[500px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center min-h-[100px]">
            <Skeleton className="h-6 w-40" />
          </div>
        ) : (
          <AllTasksPage />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
