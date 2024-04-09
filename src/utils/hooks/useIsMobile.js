import { useEffect, useState } from "react";

const isClient = () => typeof window === "object";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!isClient) return;

    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};
