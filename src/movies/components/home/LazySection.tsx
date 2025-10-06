import { useInView } from "react-intersection-observer";

export const LazySection = ({ children }: { children: React.ReactNode }) => {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "200px" });
  return <div ref={ref}>{inView ? children : null}</div>;
};
