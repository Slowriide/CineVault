export const getOptimalBackdropSize = () => {
  if (window.innerWidth < 768) return "w780"; // móviles
  if (window.innerWidth < 1536) return "w1280"; // pantallas medianas (laptops)
  return "original"; // pantallas grandes o 4K
};
