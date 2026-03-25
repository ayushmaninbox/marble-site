
import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
    title: 'About Our Legacy - Shree Radhe Marble & Granite',
    description: 'Learn about the heritage and values of Shree Radhe Marble & Granite. Agartala\'s trusted partner for premium stones, commitment to quality, and artistic stone craftsmanship.',
    keywords: ['marble showroom agartala history', 'best granite supplier tripura', 'shree radhe marble mission', 'premium stone craftsmanship'],
    openGraph: {
        title: "About | Shree Radhe Marble & Granite",
        description: "A legacy of quality and trust in the premium stone industry of Agartala.",
        images: ["/Assets/logo_new.png"],
    },
};

export default function AboutPage() {
    return <AboutClient />;
}
