import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CV Match — Análise ATS com IA",
  description:
    "Analise seu currículo com IA e descubra o score de compatibilidade ATS com a vaga desejada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        notoSans.variable
      )}
    >
      <body className="flex min-h-svh flex-col">
        <ThemeProvider>
          <header className="border-b">
            <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
              <span className="font-semibold text-lg tracking-tight">
                CV Match
              </span>
            </div>
          </header>

          <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-4 sm:py-8">
            {children}
          </main>

          <footer className="border-t">
            <div className="mx-auto flex h-12 max-w-3xl items-center justify-center px-4 text-muted-foreground text-sm">
              <a
                href="https://github.com/HenriqueBragaMoreira/cv-match"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                GitHub
              </a>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
