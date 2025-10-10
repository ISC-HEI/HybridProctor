import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.scss";
import storage from "@/lib/services/storage";
import NewPassword from "@/components/newPassword";


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
        {
          !storage.newPassword
            ?
            children
            :
            <NewPassword password={storage.newPassword} /> 
        }
      </body>
    </html>
  );
}
