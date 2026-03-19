import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700", "900"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Designathon /26 | IEEE CS",
  description: "IEEE CS Design on Domain Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans flex flex-col min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
