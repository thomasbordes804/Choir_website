import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

import { BackgroundAudio } from "@/components/layout/background-audio";
import { MainNav } from "@/components/navigation/main-nav";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Church Choir Collective",
    template: "%s — Church Choir Collective",
  },
  description: "Discover upcoming events, music, and people who bring the church choir to life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[color:var(--background)] text-[color:var(--foreground)] antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-transparent bg-white/70 shadow-sm backdrop-blur-xl dark:bg-black/40">
            <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-zinc-900 transition hover:text-[color:var(--accent)] dark:text-zinc-100"
                >
                  <span className="h-3 w-3 rounded-full bg-[color:var(--accent)]" aria-hidden />
                  Church Choir
                </Link>
              </div>
              <MainNav />
            </div>
          </header>

          <main className="flex-1 bg-gradient-to-b from-white/60 via-white to-white/80 dark:from-black/70 dark:via-black/80 dark:to-black">
            {children}
          </main>

          <footer className="mt-16 border-t border-white/40 bg-white/70 py-8 text-sm text-zinc-600 backdrop-blur-xl dark:border-white/10 dark:bg-black/40 dark:text-zinc-400">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 lg:px-8">
              <p>&copy; {new Date().getFullYear()} Church Choir Collective. All rights reserved.</p>
              <p>Powered by Sanity &amp; Next.js.</p>
            </div>
          </footer>
        </div>
        <BackgroundAudio />
      </body>
    </html>
  );
}
