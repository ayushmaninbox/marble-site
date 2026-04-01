import type { Metadata } from "next";
import { Jost } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shreeradhemarbles.in"),
  title: {
    default: "Shree Radhe Marble & Granite - Premium Marbles, Tiles & Handicrafts",
    template: "%s | Shree Radhe Marble & Granite",
  },
  description: "Discover premium quality marbles, tiles, and handicraft products at Shree Radhe Marble & Granite. Browse our exclusive collection and order online.",
  keywords: ["marble", "tiles", "granite", "handicraft", "premium marble", "Indian marble"],
  alternates: {
    canonical: "/",
  },
};

import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SchemaMarkup from "@/components/SchemaMarkup";

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Shree Radhe Marble & Granite",
  "image": "https://www.shreeradhemarbles.in/Assets/logo_new.png", 
  "@id": "https://www.shreeradhemarbles.in/",
  "url": "https://www.shreeradhemarbles.in/",
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
  "sameAs": [
    "https://www.facebook.com/sriradhemarblegranite",
    "https://www.instagram.com/shree_radhe_marble/",
    "https://www.youtube.com/@Shree_Radhe_Marble"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${jost.variable} antialiased`}>
        {/* Google Analytics Tracking */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CNF8P8CVB6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CNF8P8CVB6');
          `}
        </Script>
        <SchemaMarkup schema={businessSchema} />
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
