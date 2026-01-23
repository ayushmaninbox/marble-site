import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: {
    default: "Shree Radhe Marble & Granite - Premium Marbles, Tiles & Handicraft",
    template: "%s | Shree Radhe Marble & Granite",
  },
  description: "Discover premium quality marbles, tiles, and handicraft products at Shree Radhe Marble & Granite. Browse our exclusive collection and order online.",
  keywords: ["marble", "tiles", "granite", "handicraft", "premium marble", "Indian marble"],
};

import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SchemaMarkup from "@/components/SchemaMarkup";

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Shree Radhe Marble & Granite",
  "image": "https://shreeradhe.vercel.app/assets/logo_new.png", // Replace with real domain if available
  "@id": "https://shreeradhe.vercel.app/",
  "url": "https://shreeradhe.vercel.app/",
  "telephone": "+918794946566",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "AA Road, Kashipur Bazar",
    "addressLocality": "Agartala",
    "postalCode": "799008",
    "addressRegion": "Tripura",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 23.8315, // Approximate for Agartala
    "longitude": 91.2868
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "opens": "09:00",
    "closes": "19:00"
  },
  "sameAs": [] // Add social media links here
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${jost.variable} antialiased`}>
        <SchemaMarkup schema={businessSchema} />
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
