import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Premium Marbles, Tiles & Handicraft", // Will be prefixed by template
  description: "Discover premium quality marbles, tiles, and handicraft products at Shree Radhe Marble & Granite. Browse our exclusive collection and order online.",
  keywords: ["marble", "tiles", "granite", "handicraft", "premium marble", "Indian marble"],
};

export default function Home() {
  return <HomeClient />;
}
