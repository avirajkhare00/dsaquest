import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
      <body className="min-h-full flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-100 bg-white py-6 text-center text-sm text-gray-500">
          <p>🧠 DSAQuest — Built for interview warriors 💪</p>
        </footer>
      </body>
    </html>
  );
}
