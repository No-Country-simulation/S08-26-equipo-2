import { LoginForm } from "@/components/forms/LoginForm";

export default function Login(){
    return (
        <div className="flex flex-col min-h-full justify-center items-center">
            <h1 className="font-extrabold" >Meetflow</h1>
             <LoginForm/>
        </div>
       
    )
}