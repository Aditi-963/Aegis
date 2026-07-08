import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AEGIS: AI Race Strategist Cockpit",
  description: "Futuristic human-aware cyber-physical strategy operations center for Formula-1 racing intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#050505] text-white">
        {children}
      </body>
    </html>
  );
}
