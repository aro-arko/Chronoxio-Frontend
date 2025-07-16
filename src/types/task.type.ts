export type TTask = {
  _id: string;
  title: string;
  description: string;
  status: "in-complete" | "completed";
  priority: "low" | "medium" | "high";
  deadline?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
