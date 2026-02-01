'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center px-4">
      <div className="relative w-24 h-24 mb-8">
        {/* Decorative elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-stone-100 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 border border-stone-100 rounded-full border-dashed"
        />
        
        {/* Main Loading Pulse - Marble Style */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-2 bg-gradient-to-br from-red-600/20 to-orange-500/20 rounded-full blur-xl"
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border border-stone-50 overflow-hidden relative">
             {/* Rotating Marble Texture (Simulated) */}
             <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-full h-full bg-gradient-to-tr from-red-600/10 via-white to-orange-500/10"
             />
              <div className="absolute inset-0 flex items-center justify-center p-1.5">
                <img src="/Assets/logo_new.png" alt="Logo" className="w-full h-full object-contain drop-shadow-sm" />
              </div>
          </div>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">
          Curating Excellence
        </p>
        <div className="flex items-center justify-center gap-1.5">
          <div className="h-0.5 w-8 bg-stone-200 rounded-full overflow-hidden">
            <motion.div 
              animate={{ x: [-32, 32] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full bg-red-600"
            />
          </div>
        </div>
      </motion.div>

      {/* Background Text Pattern */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden opacity-[0.03] select-none pointer-events-none">
        <div className="text-[20vw] font-serif font-black uppercase text-slate-900 leading-none whitespace-nowrap">
          SHREE RADHE SHREE RADHE
        </div>
      </div>
    </div>
  );
}
