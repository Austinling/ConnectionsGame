import { Circle } from "react-konva";
import type { Bullet } from "../types";

type BulletsProps = {
  bullets: Bullet[];
};

export function Bullets({ bullets }: BulletsProps) {
  return (
    <>
      {bullets.map((b) => (
        <Circle
          key={b.id}
          x={b.x}
          y={b.y}
          radius={5}
          fill="#ff00ff"
          shadowBlur={10}
          shadowColor="#ff00ff"
        />
      ))}
    </>
  );
}
