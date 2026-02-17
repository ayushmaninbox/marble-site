# Shree Radhe Marble & Granite

A premium web application for a marble and granite business, featuring a dynamic product showcase, rich-text blogging system, and a custom administrative dashboard with local CSV-based data persistence.

## 🚀 Features

- **Dynamic Product Showcase**: Categorized product displays with smooth animations and interactive tabs.
- **Admin Dashboard**: Secure management of products, blogs, enquiries, and users.
- **CSV Data Persistence**: Lightweight data storage solution using local CSV files for simplified deployment.
- **Rich-Text Blog System**: Full-featured editor using Tiptap for creating and managing engaging content.
- **Quote Request System**: Integrated enquiry forms for potential customers.
- **Animated UI**: High-performance animations using Framer Motion and custom CSS transitions.
- **WhatsApp Integration**: Floating contact button for immediate customer support.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Editor**: [Tiptap](https://tiptap.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Parsing**: [PapaParse](https://www.papaparse.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📁 Project Structure

```bash
├── app/              # Next.js App Router (Pages, API routes)
├── components/       # Reusable UI components
├── data/             # CSV storage (products, blogs, enquiries, users)
├── lib/              # Utility functions and shared logic
├── public/           # Static assets (images, fonts, icons)
└── styles/           # Global styles and Tailwind configuration
```

## ⚙️ Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ayushmaninbox/marble-site.git
   cd marble-site
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔒 Admin Access

The admin panel is located at `/admin`. Authentication is managed via a simple user system stored in `data/users.csv`.

## 🌐 Deployment

For detailed deployment instructions on Hostinger VPS using PM2 and Nginx, please refer to [DEPLOY.md](file:///Users/ayushmaninbox/Documents/Freelance/marble-site/DEPLOY.md).

## 📄 License

This project is private and intended for freelance use by Shree Radhe Marble & Granite.
