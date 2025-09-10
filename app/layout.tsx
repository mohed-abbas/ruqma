import type { Metadata } from "next";
import { IBM_Plex_Sans, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ruqma",
  description: "A modern platform to buy luxury goods.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexSans.variable} ${nunitoSans.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
