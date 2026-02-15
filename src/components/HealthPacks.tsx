import type { HealthPacks } from "../types";
import { Group, Rect, Circle } from "react-konva";

type HealthPackProps = {
  healthPacks: HealthPacks[];
};

export function HealthPacks({ healthPacks }: HealthPackProps) {
  return (
    <>
      {healthPacks.map((pack) => (
        <Group key={pack.id} x={pack.x} y={pack.y}>
          <Rect
            width={20}
            height={20}
            fill="white"
            cornerRadius={3}
            shadowBlur={5}
            shadowColor="red"
            offsetX={10}
            offsetY={10}
          />
          <Rect width={4} height={12} fill="red" x={-2} y={-6} />
          <Rect width={12} height={4} fill="red" x={-6} y={-2} />

          <Circle
            radius={15 + Math.sin(Date.now() * 0.01) * 5}
            stroke="red"
            strokeWidth={2}
            opacity={0.5}
          />
        </Group>
      ))}
    </>
  );
}
