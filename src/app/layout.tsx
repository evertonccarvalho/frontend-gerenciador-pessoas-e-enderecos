import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/providers/providers";
import "./styles/globals.css";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Desafio FullStack",
  description: "Gerenciador de Pessoas e Endereços",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
