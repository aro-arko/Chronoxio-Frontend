import LoginForm from "@/components/modules/auth/login/LoginForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

const LoginPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen"> </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
