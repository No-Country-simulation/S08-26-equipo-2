import { LoginForm } from "@/components/forms/LoginForm";
import { Video } from "lucide-react";
import Spacing from "@/components/Spacing";

export default function Login() {
  return (
    <div className="flex flex-col min-h-full justify-center items-center">
      <div className="flex justify-center items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600">
          <Video className="size-5 text-white" />
        </div>
        <h1 className="font-extrabold text-3xl">Meetflow</h1>
      </div>

      <Spacing />
      <LoginForm />
    </div>
  );
}
