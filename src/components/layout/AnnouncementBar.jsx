import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SITE } from '../../config/site';

export default function AnnouncementBar() {
  const items = SITE.announcements;
  const [i, setI] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 4200);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <div className="bg-ink text-paper">
      <div className="wrap flex h-9 items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-[11px] font-medium uppercase tracking-label"
          >
            {items[i]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
