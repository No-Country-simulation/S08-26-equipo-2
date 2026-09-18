import { Button } from "@/components/ui/button";
import googleIcon from "@/assets/icons/google.svg";

export default function GoogleButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full btn-ghost"
      onClick={() => console.log("Google login click")}
    >
      <img src={googleIcon} alt="Google" width={20} />
      Continuar con Google
    </Button>
  );
}
