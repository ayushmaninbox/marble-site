'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const WHATSAPP_NUMBER = "918794946566";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true); // Visible from start
  const [isForcedHidden, setIsForcedHidden] = useState(false); // For modal overlap
  const [showTooltip, setShowTooltip] = useState(false);
  const [productName, setProductName] = useState<string | null>(null);

  // Listen for product name updates from individual pages
  useEffect(() => {
    const handleContextUpdate = (e: any) => {
      if (e.detail?.productName) {
        setProductName(e.detail.productName);
      }
    };

    const handleVisibilityUpdate = (e: any) => {
      if (typeof e.detail?.visible === 'boolean') {
        setIsForcedHidden(!e.detail.visible);
      }
    };

    window.addEventListener('set-whatsapp-context', handleContextUpdate);
    window.addEventListener('toggle-whatsapp-visibility', handleVisibilityUpdate);
    
    return () => {
      window.removeEventListener('set-whatsapp-context', handleContextUpdate);
      window.removeEventListener('toggle-whatsapp-visibility', handleVisibilityUpdate);
    };
  }, []);

  // Reset product name on pathname change to avoid stale context
  useEffect(() => {
    setProductName(null);
  }, [pathname]);

  // No longer hiding on scroll - keeping it visible per user request
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Set tooltip to appear after a delay and disappear after 2 seconds
  useEffect(() => {
    let showTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    if (isVisible) {
      showTimer = setTimeout(() => {
        setShowTooltip(true);
        // Hide after another 2 seconds
        hideTimer = setTimeout(() => setShowTooltip(false), 2000);
      }, 1500);
    } else {
      setShowTooltip(false);
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isVisible]);

  const getWhatsAppUrl = () => {
    let message = "Hi! I'm interested in your marble and granite collection. Could you please share more details?";
    
    // Check if on a product or blog page to customize message
    if (pathname.includes('/products/')) {
      message = `Hi! I'm interested in "${productName || 'one of your products'}". Could you please share the latest pricing and availability?`;
    } else if (pathname.includes('/blogs/')) {
        message = "Hi! I just read your blog post and had some questions about your materials.";
    }

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <AnimatePresence>
      {isVisible && !isForcedHidden && (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white px-4 py-2 rounded-xl shadow-xl border border-stone-100 text-slate-700 text-sm font-medium pointer-events-auto"
              >
                Need help? Chat with us!
                <div className="absolute right-4 -bottom-1 w-2 h-2 bg-white border-r border-b border-stone-100 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 md:w-14 md:h-14 bg-[#25D366] rounded-full shadow-lg shadow-green-200/50 flex items-center justify-center text-white pointer-events-auto relative group active:bg-[#128C7E] transition-colors"
          >
            <svg 
              className="w-7 h-7 md:w-8 md:h-8 relative z-10 fill-current" 
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .011 5.403.01 12.04c0 2.123.554 4.197 1.606 6.04L0 24l6.124-1.607a11.777 11.777 0 005.918 1.586h.004c6.635 0 12.039-5.405 12.043-12.041a11.818 11.818 0 00-3.518-8.528" />
            </svg>
          </motion.a>
        </div>
      )}
    </AnimatePresence>
  );
}
