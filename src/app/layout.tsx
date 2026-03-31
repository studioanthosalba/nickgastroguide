import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nick GastroGuide | La Tua Guida del Gusto",
  description: "Un concierge digitale che accoglie i tuoi ospiti con il calore di una volta e la potenza dell'intelligenza artificiale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased selection:bg-amber-500/30 selection:text-amber-200 bg-black min-h-screen text-white`}
      >
        {children}
      </body>
    </html>
  );
}
