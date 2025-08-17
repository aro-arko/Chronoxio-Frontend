import Users from "@/components/modules/users/Users";
import { allUsers } from "@/services/UserService";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "Manage user accounts and permissions",
};

export default async function UsersPage() {
  const res = await allUsers();
  return (
    <div className="p-4 sm:p-6">
      <Users initialUsers={res?.data ?? []} />
    </div>
  );
}
