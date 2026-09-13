import { SignupForm } from "@/components/forms/SignupForm";

export default function Signup(){
    return (
        <div className="flex flex-col min-h-full justify-center items-center">
            <h1 className="font-extrabold" >Meetflow</h1>
             <SignupForm/>
        </div>
       
    )
}