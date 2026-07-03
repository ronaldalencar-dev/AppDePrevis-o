import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clima · Previsão do Tempo",
  description: "Aplicativo moderno de previsão do tempo com geolocalização, previsão de 5 dias, favoritos, tema claro/escuro e mais. Powered by Open-Meteo.",
  keywords: ["clima", "previsão do tempo", "weather", "Open-Meteo", "temperatura", "previsão"],
  authors: [{ name: "Clima App" }],
  openGraph: {
    title: "Clima · Previsão do Tempo",
    description: "Previsão do tempo em tempo real para qualquer cidade do mundo.",
    siteName: "Clima",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clima · Previsão do Tempo",
    description: "Previsão do tempo em tempo real para qualquer cidade do mundo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
