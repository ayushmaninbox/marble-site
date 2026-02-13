
import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
    title: 'About Us - Shree Radhe Marble & Granite',
    description: 'Learn about Shree Radhe Marble & Granite, our legacy, mission, and commitment to providing premium quality stones and exceptional service.',
    keywords: ['about marble company', 'granite supplier history', 'stone business mission', 'premium stone values'],
};

export default function AboutPage() {
    return <AboutClient />;
}
