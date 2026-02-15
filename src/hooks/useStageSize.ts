import { useEffect, useState } from "react";

type StageSize = {
  width: number;
  height: number;
};

export function useStageSize(): StageSize {
  const [size, setSize] = useState<StageSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
