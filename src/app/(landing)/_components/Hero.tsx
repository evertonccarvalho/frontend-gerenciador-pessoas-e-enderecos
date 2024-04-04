"use client";
import Link from "next/link";
import { LogIn, LogInIcon, UserCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthContext";

export const Hero = () => {
	const { user } = useAuth();
	return (
		<section className="container h-full flex-col md:flex-row place-items-center justify-center flex py-4 md:py-24 gap-10">
			<div className="text-center w-full h-full space-y-6">
				{user ? (
					<main className="text-4xl md:text-6xl font-bold">
						<h1 className="inline ">
							<span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
								Bem-vindo
							</span>{" "}
							de
						</h1>{" "}

						<h2 className="inline ">
							<span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
								volta
							</span>{" "}
							{user.name}
						</h2>
					</main>
				) : (
					<main className="text-4xl md:text-6xl font-bold">
						<h1 className="inline ">
							<span className="bg-clip-text">
								Gerenciamento
							</span>{" "}
							de pessoas{" "}
						</h1>
						<h2 className="inline ">
							<span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
								e seus
							</span>{" "}
							endereços.
						</h2>
					</main>
				)}

				<div className="space-y-4 md:space-y-0 md:space-x-4">
					{user ? (
						<Link href="/dashboard" className={`border w-1/2 ${buttonVariants({ variant: "default" })}`}>
							<LogIn className="mr-2 w-5 h-5" />
							Minha Conta
						</Link>
					) : (
						<>
							<Link
								href="/auth/register"
								className={`w-full md:w-1/3 text-white/80 ${buttonVariants({
									variant: "default",
								})}`}
							>
								Criar Conta
								<UserCheck className="ml-2 w-5 h-5" />
							</Link>
							<Link
								href="/auth/login"
								className={`w-full md:w-1/3 ${buttonVariants({
									variant: "outline",
								})}`}
							>
								Entrar
								<LogInIcon className="ml-2 w-5 h-5" />
							</Link>
						</>
					)}
				</div>
			</div>


		</section>
	)
};
