import { useEffect, useState, useRef } from "react";
import { Stage, Layer, Circle } from "react-konva";
import { usePlayerMovement } from "./PlayerMovement";
import Konva from "konva";

export function StageBackground() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const { playerLocation, update } = usePlayerMovement();
  const circleRef = useRef<Konva.Circle>(null);

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let frameId: number;

    const loop = () => {
      const newPos = update();

      if (circleRef.current && newPos) {
        circleRef.current.x(newPos.x);
        circleRef.current.y(newPos.y);
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId);
  }, [update]);

  return (
    <Stage width={size.width} height={size.height}>
      <Layer>
        <Circle
          ref={circleRef}
          x={playerLocation.current.x}
          y={playerLocation.current.y}
          radius={50}
          fill="green"
        />
      </Layer>
    </Stage>
  );
}
