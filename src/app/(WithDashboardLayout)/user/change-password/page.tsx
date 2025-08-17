import ChangePassword from "@/components/modules/Change Password/ChangePassword";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change Password",
  description: "Change your account password",
};

export default function ChangePasswordUserPage() {
  return (
    <div className="p-4 sm:p-6">
      <ChangePassword />
    </div>
  );
}
