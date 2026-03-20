import { Transition, Variants } from 'framer-motion';

/**
 * Default spring configuration matching motion.dev's defaults
 * Duration: ~0.3s equivalent
 */
export const defaultSpring: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 1,
};

/**
 * Slower spring for more dramatic animations
 */
export const slowSpring: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
  mass: 1,
};

/**
 * Faster, snappier spring
 */
export const fastSpring: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 35,
  mass: 0.8,
};

/**
 * Fade in with slide up animation (common for hero sections)
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultSpring,
  },
};

/**
 * Fade in animation only
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: defaultSpring,
  },
};

/**
 * Slide in from left
 */
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultSpring,
  },
};

/**
 * Slide in from right
 */
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultSpring,
  },
};

/**
 * Scale up with fade in
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: defaultSpring,
  },
};
