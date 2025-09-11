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
  title: "Ruqma - Beyond Ordinary | Luxury Goods Platform",
  description: "Discover extraordinary luxury goods with Ruqma. Beyond ordinary experiences await with our curated collection of premium products.",
  keywords: ["luxury", "premium", "goods", "ruqma", "beyond ordinary", "exclusive"],
  authors: [{ name: "Ruqma" }],
  creator: "Ruqma",
  publisher: "Ruqma",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ruqma.com'), // Replace with your actual domain
  openGraph: {
    title: "Ruqma - Beyond Ordinary",
    description: "Discover extraordinary luxury goods with Ruqma. Beyond ordinary experiences await.",
    url: 'https://ruqma.com', // Replace with your actual domain
    siteName: 'Ruqma',
    images: [
      {
        url: '/og-image.jpg', // You'll need to add this image
        width: 1200,
        height: 630,
        alt: 'Ruqma - Beyond Ordinary',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ruqma - Beyond Ordinary',
    description: 'Discover extraordinary luxury goods with Ruqma.',
    images: ['/og-image.jpg'], // You'll need to add this image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
