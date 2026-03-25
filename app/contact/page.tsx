import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Get in Touch',
  description: 'Connect with Shree Radhe Marble & Granite in Agartala. Contact us for premium marble quotes, customized stone projects, or visiting our showroom.',
  keywords: ['contact marble shop agartala', 'request stone quote', 'marble showroom location tripura', 'stone consultancy agartala'],
  openGraph: {
    title: "Contact Us | Shree Radhe Marble & Granite",
    description: "Ready to start your project? Reach out for expert stone advice and premium quotes.",
    images: ["/Assets/logo_new.png"],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
