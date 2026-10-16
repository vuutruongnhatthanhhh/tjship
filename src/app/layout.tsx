import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import AssistantWidget from "@/components/AssistantWidget";
import BackToTopButton from "@/components/BackToTopButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TJShip — Giao vận thông minh",
  description: "Nền tảng quản lý giao hàng và lấy hàng TJShip (bản demo giao diện)",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-background text-foreground">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="min-w-0 flex-1 overflow-x-hidden pb-16 md:pb-0">{children}</div>
        </div>
        <MobileNav />
        <AssistantWidget />
        <BackToTopButton />
      </body>
    </html>
  );
}
