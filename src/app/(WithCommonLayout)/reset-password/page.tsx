import ResetPassword from "@/components/modules/auth/Reset Password/ResetPassword";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your password for Chronoxio.",
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div></div>}>
      <ResetPassword />
    </Suspense>
  );
};

export default ResetPasswordPage;
