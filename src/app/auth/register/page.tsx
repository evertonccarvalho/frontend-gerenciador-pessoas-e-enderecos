import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
	return (
		<div className="relative h-screen flex-col items-center justify-center lg:px-0 bg-gradient-to-b to-gray-500/30 from-black/10">
			<div className="p-4 lg:p-8 h-full flex items-center">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">Registro</h1>
						<p className="text-sm text-muted-foreground">
							Digite seu e-mail abaixo para fazer login na sua conta
						</p>
					</div>
					{/* <UserAuthForm /> */}
					<RegisterForm />
					<p className="px-8 text-center text-sm text-muted-foreground">
						Já tem uma conta?{" "}
						<Link
							href="/auth/login"
							className="underline underline-offset-4 hover:text-primary"
						>
							Fazer Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
