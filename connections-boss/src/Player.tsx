import { Circle, Group, Rect } from "react-konva";
import Konva from "konva";

export function Player({
  playerRef,
}: {
  playerRef: React.RefObject<Konva.Group | null>;
}) {
  const time = Date.now() * 0.0005;

  return (
    <Group ref={playerRef} width={100} height={100}>
      <Circle
        x={0}
        y={0}
        radius={10}
        initialY={0}
        fill="green"
        stroke="black"
        strokeWidth={4}
      />
      <Rect
        x={-10}
        y={20}
        initialY={20}
        width={20}
        height={50}
        fill="green"
        stroke="black"
        strokeWidth={4}
      />
      <Rect
        x={30}
        y={30}
        initialY={30}
        width={30}
        height={10}
        fill="green"
        stroke="black"
        strokeWidth={4}
        rotationDeg={45}
      />
      <Rect
        x={-20}
        y={30}
        initialY={30}
        width={30}
        height={10}
        fill="green"
        stroke="black"
        strokeWidth={4}
        rotationDeg={135}
      />
      <Rect
        x={20}
        y={80}
        initialY={80}
        width={30}
        height={10}
        fill="green"
        stroke="black"
        strokeWidth={4}
        rotationDeg={60}
      />
      <Rect
        x={-10}
        y={80}
        initialY={80}
        width={30}
        height={10}
        fill="green"
        stroke="black"
        strokeWidth={4}
        rotationDeg={120}
      />
    </Group>
  );
}
