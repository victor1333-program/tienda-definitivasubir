import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lovilike Personalizados - Productos Únicos para Eventos Especiales",
  description: "Productos personalizados para bodas, comuniones, bautizos, baby shower y textil personalizado. Detalles únicos para tus momentos especiales.",
  keywords: "productos personalizados, bodas, comuniones, bautizos, baby shower, textil personalizado, tazas personalizadas, eventos especiales",
  robots: "index, follow",
  authors: [{ name: "Lovilike Personalizados" }],
  generator: "Next.js",
  applicationName: "Lovilike Personalizados",
  referrer: "origin-when-cross-origin",
  colorScheme: "light",
  themeColor: "#FB6D0E",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
      </head>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
