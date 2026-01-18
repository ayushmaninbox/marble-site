import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "Shree Radhe Marble & Granite - Premium Marbles, Tiles & Handicraft",
  description: "Discover premium quality marbles, tiles, and handicraft products at Shree Radhe Marble & Granite. Browse our exclusive collection and order online.",
  keywords: ["marble", "tiles", "granite", "handicraft", "premium marble", "Indian marble"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${jost.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
