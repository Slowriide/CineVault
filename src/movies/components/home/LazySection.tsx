import { useInView } from "react-intersection-observer";

/**
 * Lazy-loads its children when the section comes into the viewport.
 * Uses Intersection Observer with a 200px root margin for early loading.
 */
export const LazySection = ({ children }: { children: React.ReactNode }) => {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "200px" });

  // Only render children when the element is in view
  return <div ref={ref}>{inView ? children : null}</div>;
};
