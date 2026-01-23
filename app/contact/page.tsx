import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Shree Radhe Marble & Granite for inquiries, quotes, or to discuss your stone project requirements.',
  keywords: ['contact stone supplier', 'marble quotes', 'granite inquiry', 'stone showroom location'],
};

export default function ContactPage() {
  return <ContactClient />;
}
