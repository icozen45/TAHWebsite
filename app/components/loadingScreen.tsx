'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // ✅ added useRouter
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem('seenLoader');

    // ✅ Only show on '/' and first time
    if (pathname === '/' && !alreadySeen) {
      sessionStorage.setItem('seenLoader', 'true');

      router.prefetch('/services');
      router.prefetch('/blogs');
      router.prefetch('/case-studies');
      console.log('🚀 Prefetching necessary routes...');

      const totalDisplayTime = 1600 + 2000; // 3.6s
      const timer = setTimeout(() => setIsVisible(false), totalDisplayTime);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 100);
      return () => clearTimeout(timer);
    }
  }, [pathname, router]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 20 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-4xl sm:text-6xl font-bold text-gray-800"
            >
              Global Project Solutions
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, duration: 0.4 }}
              className="mt-6 h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
