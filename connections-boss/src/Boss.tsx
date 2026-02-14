import { Group, Circle, Rect } from "react-konva";
import Konva from "konva";
import { HealthBar } from "./HealthBar";

export function Boss({
  bossRef,
  bossHealth,
}: {
  bossRef: React.RefObject<Konva.Group | null>;
  bossHealth: number;
}) {
  return (
    <>
      <Group ref={bossRef}>
        <Circle radius={50} fill="darkred" stroke="black" strokeWidth={5} />

        <Rect
          x={-80}
          y={-30}
          initialY={-30}
          width={20}
          height={60}
          fill="orange"
          stroke="black"
        />

        <Rect
          x={60}
          y={-30}
          initialY={-30}
          width={20}
          height={60}
          fill="orange"
          stroke="black"
        />

        <HealthBar bossRef={bossRef} bossHealth={bossHealth} />
      </Group>
    </>
  );
}
