import type { Metadata } from "next";
import { IBM_Plex_Sans, Nunito_Sans } from "next/font/google";
import "./globals.css";


const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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
    <html lang="en" className={`${ibmPlexSans.variable} ${nunitoSans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
