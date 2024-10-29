import LoginForm from "@/app/components/LoginForm";

export const metadata = {
    title: "Login",
    description: "Login to NEVERBE POS",
}
export default function Home() {
    return (
        <main className='min-h-screen w-full flex justify-center items-center'>
            <LoginForm/>
        </main>
    );
}
