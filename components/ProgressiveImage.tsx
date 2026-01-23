'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressiveImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  containerClassName?: string;
}

export default function ProgressiveImage({ 
  src, 
  alt, 
  className = '', 
  containerClassName = '',
  fill,
  sizes,
  priority,
  ...props 
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Fallback to force show image if it's taking too long (e.g. slow network or minor issues)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative overflow-hidden ${containerClassName} ${fill ? 'w-full h-full' : ''}`}>
      {/* Marble-themed Placeholder */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10 bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100"
          >
            {/* Subtle Texture/Pattern */}
            <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none overflow-hidden flex items-center justify-center">
                <div className="text-[10vw] font-serif font-black uppercase text-slate-900 leading-none whitespace-nowrap opacity-20">
                   SHREE RADHE 
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)} // Force reveal on error
        className={`transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        {...props}
      />
    </div>
  );
}
