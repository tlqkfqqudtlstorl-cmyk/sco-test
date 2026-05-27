import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/lib/ThemeProvider";
import { getCurrentUserOptional } from "@/lib/auth/current-user";
import "./globals.css";

export const dynamic = 'force-dynamic';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-code",
});

export const metadata: Metadata = {
  title: {
    default: "sco",
    template: "%s · sco",
  },
  description: "sco·프로그래밍 문제 풀이와 채점을 위한 온라인 저지",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserOptional();

  return (
      <html
        lang="ko"
        className={`${outfit.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
      <body className="min-h-dvh bg-[var(--bg-primary)] font-sans antialiased">
        <ThemeProvider>
          <Navbar user={user} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
