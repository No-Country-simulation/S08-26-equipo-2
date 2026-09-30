import { SignupForm } from "../components/SignupForm";
import { Video } from "lucide-react";
import Spacing from "@/components/Spacing";

export function SignupView() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center p-4 bg-background">
      <div className="flex justify-center items-center gap-3 mb-2">
        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-500/20">
          <Video className="size-5 text-white" />
        </div>
        <h1 className="font-extrabold text-3xl tracking-tight text-foreground" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          Meetflow
        </h1>
      </div>

      <Spacing />
      <SignupForm />
    </div>
  );
}

export default SignupView;
