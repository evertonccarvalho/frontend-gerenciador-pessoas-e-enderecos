"use client";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { LogIn, LogInIcon, Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/providers/AuthContext";


interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#features",
    label: "Recursos",
  },
];

export const Navbar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <header className="absolute border-b-[1px] top-0  z-40 w-full bg-background  dark:border-b-slate-700 ">

      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">

            <Link href="/" className="ml-2 font-bold text-xl flex">
              <div className="relative h-8 w-24 ">
                <Image fill alt="logo" src="/logo.png" />
              </div>
            </Link>
          </NavigationMenuItem>

          {/* mobile */}
          <div className="flex md:hidden">

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                />
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    <Image alt="logo" src="/logo.png" className="w-28" width={100} height={100} />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </Link>
                  ))}
                  <Link
                    href="/auth/login"
                    className={`w-[110px] border text-white ${buttonVariants({
                      variant: "secondary",
                    })}`}
                    rel="noreferrer"
                  >
                    <LogInIcon className="mr-2 w-5 h-5 " />
                    Entrar
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>



          <div className="hidden md:flex gap-2">
            {user ? (
              <Link href="/dashboard" className={`border ${buttonVariants({ variant: "default" })}`}>
                <LogIn className="mr-2 w-5 h-5" />
                Minha Conta
              </Link>
            ) : (
              <Link href="/auth/login" className={`border text-white ${buttonVariants({ variant: "default" })}`}>
                <LogIn className="mr-2 w-5 h-5" />
                Entrar
              </Link>
            )}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
