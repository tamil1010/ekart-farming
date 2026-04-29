import { motion, AnimatePresence } from 'motion/react';
import { Store, Leaf } from 'lucide-react';
import { useEffect, useState } from 'react';

const BrandIntro = ({ onComplete }) => {
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTagline(true);
    }, 2500);
    
    const exitTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Gradient Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#0d9488_0%,_#042f2e_40%,_#000000_100%)] opacity-90" />

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-brand-primary/20"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: window.innerHeight + 100,
            rotate: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: -100, 
            rotate: 360,
            x: (Math.random() - 0.5) * 200 + (Math.random() * window.innerWidth)
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          <Leaf className="w-4 h-4" />
        </motion.div>
      ))}

      <div className="relative flex flex-col items-center">
        {/* Glowing Icon */}
        <motion.div
          initial={{ scale: 0, rotateY: 180, opacity: 0 }}
          animate={{ scale: 1, rotateY: 0, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15,
            duration: 1.5 
          }}
          className="w-24 h-24 bg-brand-primary rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)] mb-8 relative z-10"
        >
          <Store className="w-12 h-12 text-[#052e16]" />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute inset-0 bg-brand-primary rounded-[2rem] blur-2xl -z-10"
          />
        </motion.div>

        {/* Text Animation */}
        <div className="flex flex-col items-center [perspective:1000px]">
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: -45, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
            className="flex items-center relative overflow-hidden group"
          >
            <h1 className="text-7xl md:text-8xl font-sans font-black tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
              <span className="text-white">Agro</span>
              <span className="text-brand-primary">Mart</span>
            </h1>
            <motion.div 
              animate={{ 
                x: ["-100%", "200%"],
              }}
              transition={{ 
                delay: 1.8,
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
            />
          </motion.div>

          {/* Glowing Underline */}
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent mt-2 shadow-[0_0_20px_rgba(34,197,94,0.8)]"
          />

          {/* Tagline */}
          <AnimatePresence>
            {showTagline && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-text-secondary text-sm font-bold uppercase tracking-[0.4em] mt-6"
              >
                Premium Agricultural Mart
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Cinematic Lighting Flares */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px]" />
    </motion.div>
  );
};

export default BrandIntro;
