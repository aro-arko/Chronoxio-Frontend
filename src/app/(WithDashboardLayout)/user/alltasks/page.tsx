"use client";

import { Suspense } from "react";
import AllTasks from "@/components/modules/auth/AllTasks/AllTasks";

const AllTasksPage = ({}: { searchParams?: { page?: string } }) => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          Loading tasks…
        </div>
      }
    >
      <AllTasks />
    </Suspense>
  );
};

export default AllTasksPage;
