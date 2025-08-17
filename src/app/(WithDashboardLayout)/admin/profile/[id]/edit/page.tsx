import EditProfile from "@/components/modules/Profile/EditProfile";
import { getMe } from "@/services/Profile";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Profile",
  description: "Edit your profile information",
};

export default async function EditProfileAdminPage() {
  const me = await getMe();

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>
      <EditProfile me={me.data} />
    </div>
  );
}
