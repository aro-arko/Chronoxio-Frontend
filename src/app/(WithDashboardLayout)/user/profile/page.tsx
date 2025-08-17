// app/admin/profile/page.tsx
import Profile from "@/components/modules/Profile/Profile";
import { getMe } from "@/services/Profile";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Edit your account profile",
};

export default async function ProfilePageAdmin() {
  try {
    const me = await getMe();
    console.log(me);
    return (
      <div className="p-4 sm:p-6">
        <Profile me={me.data} />
      </div>
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return (
      <div className="p-6">
        <div className="max-w-xl rounded-xl border border-red-200 bg-red-50 text-red-800 p-4">
          <p className="font-semibold">Failed to load profile</p>
          <p className="text-sm mt-1">
            {e?.message ?? "Unexpected error while fetching your profile."}
          </p>
        </div>
      </div>
    );
  }
}
