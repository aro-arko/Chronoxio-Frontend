import RegisterForm from "@/components/modules/auth/register/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account for Chronoxio.",
};

const RegisterPage = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-background">
      <div className="bg-card p-8 rounded-lg shadow-lg border border-border w-full max-w-2xl">
        {" "}
        <h1 className="text-2xl font-bold text-foreground mb-6 text-center">
          Create an Account
        </h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
