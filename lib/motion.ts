export const motionEase = [0.4, 0, 0.2, 1] as const;

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.32, ease: motionEase },
};

export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: motionEase },
};

export const slideQuestion = (direction: number) => ({
  initial: { opacity: 0, x: direction > 0 ? 28 : -28 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: direction > 0 ? -28 : 28 },
  transition: { duration: 0.32, ease: motionEase },
});
