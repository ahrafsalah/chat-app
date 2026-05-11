import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/components/QueryProvider";
import NavBar from "@/components/NavBar";
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
  title: "chatty",
  description: "A real-time chat application built with Next.js, Socket.IO, and MongoDB. Connect with friends, share messages instantly, and enjoy a seamless chatting experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <ThemeProvider>
        <QueryProvider>
        <Toaster/>
        <NavBar/>
        {children}
        </QueryProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}