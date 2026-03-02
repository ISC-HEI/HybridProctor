
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.scss";
import NotificationsProvider from "./notificationsProvider";
import ToastList from "@/components/toastList";


const font = Inter({
  variable: "--font-poppins",
  weight: ["100", "300", "500", "700"],
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "HybridProctor",
  description: "HybridProctor for exams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className}`}>
        <NotificationsProvider>
          <ToastList />
          {
            children
          }
        </NotificationsProvider>
      </body>
    </html>
  );
}
