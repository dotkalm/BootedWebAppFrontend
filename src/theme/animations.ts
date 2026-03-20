// Shared spring animation configuration
export const springUpAnimation = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: {
    type: 'spring',
    stiffness: 200,
    damping: 30,
    mass: 1.8
  }
} as const;
