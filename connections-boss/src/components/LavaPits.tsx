import { Group, Circle } from "react-konva";
import type { LavaPit } from "../types";

type LavaPitsProps = {
  pits: LavaPit[];
};

export function LavaPits({ pits }: LavaPitsProps) {
  return (
    <>
      {pits.map((pit) => (
        <Group key={pit.id} x={pit.x} y={pit.y}>
          <Circle
            radius={45}
            fillRadialGradientStartPoint={{ x: 0, y: 0 }}
            fillRadialGradientStartRadius={0}
            fillRadialGradientEndPoint={{ x: 0, y: 0 }}
            fillRadialGradientEndRadius={45}
            fillRadialGradientColorStops={[0, "#ff4500", 1, "transparent"]}
            opacity={0.6}
          />
          <Circle
            radius={30}
            fill="#ff8c00"
            shadowBlur={15}
            shadowColor="red"
          />
        </Group>
      ))}
    </>
  );
}
