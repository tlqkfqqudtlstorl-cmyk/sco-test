import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/lib/ThemeProvider";
import { getCurrentUserOptional } from "@/lib/auth/current-user";
import "./globals.css";

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
  description: "sco·검증 중심의 알고리즘·보안·인프라 연습 저지",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserOptional();

  return (
      <html lang="ko" className={`${outfit.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh bg-[var(--bg-primary)] font-sans antialiased">
        <ThemeProvider>
          <Navbar user={user} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
