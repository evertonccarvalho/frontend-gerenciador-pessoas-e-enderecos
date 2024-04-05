"use client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/AuthContext";
import { ChevronDownIcon, User } from "lucide-react";

export function UserNav() {
	const { user, signOut } = useAuth();

	if (!user) {
		return null;
	}

	return (
		<div className="flex gap-2">
			<DropdownMenu >

				<DropdownMenuTrigger asChild className="flex w-full">
					<div className="flex  h-8 w-8 cursor-pointer rounded-full">
						<User />
						<ChevronDownIcon size={18} />
					</div>
				</DropdownMenuTrigger>
				<div>
					<div className=" hidden md:flex text-start flex-col">
						<h3 className="text-xs font-semibold">{user.name}</h3>
						<p className="text-xs ">{user.email}</p>
					</div>
				</div>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">{user.name}</p>
							<p className="text-xs leading-none text-muted-foreground">
								{user.email}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
						Sair
						<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
