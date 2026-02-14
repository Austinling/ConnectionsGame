import { useEffect, useState, useRef } from "react";
import { Stage, Layer } from "react-konva";
import { usePlayerMovement } from "./PlayerMovement";
import { Player } from "./Player";
import Konva from "konva";

export function StageBackground() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const { playerLocation, update } = usePlayerMovement();
  const playerRef = useRef<Konva.Group>(null);

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

      const children = playerRef.current?.getChildren();

      if (playerRef.current && newPos) {
        playerRef.current.x(newPos.pos.x);
        playerRef.current.y(newPos.pos.y);

        const speed = 0.005;
        const range = 5;

        const time = Date.now() * speed;

        children?.forEach((child, index) => {
          const actualChild = child as Konva.Node;
          const bob = Math.sin(time + index * 0.8) * range;
          actualChild.y(actualChild.getAttr("initialY") + bob);
        });
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId);
  }, [update]);

  return (
    <Stage width={size.width} height={size.height}>
      <Layer>
        <Player playerRef={playerRef} />
      </Layer>
    </Stage>
  );
}
