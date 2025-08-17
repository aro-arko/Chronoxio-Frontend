// app/app/tasks/page.tsx
"use client";

import Tasks from "@/components/modules/Tasks/Tasks";
import { useState } from "react";

export default function TasksPage() {
  const [showTaskModal, setShowTaskModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const [reportData, setReportData] = useState<any>(null);

  return (
    <div>
      <Tasks
        showTaskModal={showTaskModal}
        setShowTaskModal={setShowTaskModal}
        setReportData={setReportData}
      />
    </div>
  );
}
