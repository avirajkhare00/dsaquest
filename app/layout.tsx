import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DSAQuest — Learn Algorithms & Data Structures Interactively",
  description:
    "Master DSA through stories, visualizations, and quizzes. Two pointers, sliding window, sorting, trees — interview-ready in a fun, interactive way.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 text-center text-sm" style={{ borderColor: 'var(--card-border)', background: 'var(--footer-bg)', color: 'var(--muted)' }}>
            <p>🧠 DSAQuest — Built for interview warriors 💪</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
