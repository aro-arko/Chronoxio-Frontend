import ForgotPassword from "@/components/modules/auth/Forgot Password/ForgotPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password for Chronoxio.",
};

const ForgotPasswordPage = () => {
  return (
    <div>
      <ForgotPassword />
    </div>
  );
};

export default ForgotPasswordPage;
