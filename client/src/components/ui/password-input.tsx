import {
  forwardRef,
  useState,
  type ComponentProps,
} from "react";

import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PasswordInputProps = Omit<
  ComponentProps<typeof Input>,
  "type"
>;

export const PasswordInput = forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(function PasswordInput({ className, ...props }, ref) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={showPassword ? "text" : "password"}
        className={`pr-10 ${className ?? ""}`}
        {...props}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={
          showPassword
            ? "Ocultar contraseña"
            : "Mostrar contraseña"
        }
        onClick={() =>
          setShowPassword((previous) => !previous)
        }
        className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:bg-transparent hover:text-slate-200"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
});