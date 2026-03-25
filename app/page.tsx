import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Premium Marbles, Tiles & Granite in Agartala", 
  description: "Experience luxury with Shree Radhe Marble & Granite. Agartala's leading supplier of premium Indian & Italian marbles, textured tiles, and exquisite stone handicrafts.",
  keywords: ["best marble shop in agartala", "premium granite tripura", "designer tiles shop", "stone handicrafts agartala", "shree radhe marble"],
  openGraph: {
    title: "Shree Radhe Marble & Granite | Premium Stone Collection",
    description: "Agartala's premier destination for high-quality marbles, tiles, and granites. Transform your space with our exclusive collection.",
    url: "https://shreeradhemarbles.in",
    siteName: "Shree Radhe Marble & Granite",
    images: [
      {
        url: "/Assets/logo_new.png",
        width: 800,
        height: 600,
        alt: "Shree Radhe Marble & Granite Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shree Radhe Marble & Granite | Luxury Stones",
    description: "Premium marbles and tiles for your dream home. Visit our showroom in Agartala.",
    images: ["/Assets/logo_new.png"],
  },
};

export default function Home() {
  return <HomeClient />;
}
