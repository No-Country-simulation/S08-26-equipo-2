import googleIcon from "@/assets/icons/google.svg";

export default function GoogleButton() {
  return (
    <button
      type="button"
      className="btn-ghost w-full flex items-center justify-center gap-3 py-2.5 mb-5 text-sm cursor-pointer rounded-lg"
      onClick={() => console.log("Google login click")}
    >
      <img src={googleIcon} alt="Google" width={18} height={18} />
      Continuar con Google
    </button>
  );
}
