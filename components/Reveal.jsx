'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Scroll-into-view reveal. Honours the OS "reduce motion" setting by rendering
 * the content statically instead of animating it (WCAG 2.1, 2.3.3).
 */
export default function Reveal({ children, className = '', as = 'div', delay = 0 }) {
  const prefersReducedMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  if (prefersReducedMotion) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </Component>
  );
}
