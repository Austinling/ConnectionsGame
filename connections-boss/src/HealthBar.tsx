import { Group, Circle, Rect } from "react-konva";
import Konva from "konva";

export function HealthBar({
  bossRef,
  bossHealth,
}: {
  bossRef: React.RefObject<Konva.Group | null>;
  bossHealth: number;
}) {
  const barWidth = 100;
  return (
    <Group ref={bossRef}>
      <Rect
        x={-50}
        y={-70}
        width={barWidth}
        height={10}
        fill="#333"
        cornerRadius={5}
      />

      <Rect
        x={-50}
        y={-70}
        width={(bossHealth / 100) * barWidth}
        height={10}
        fill={bossHealth > 30 ? "#2ecc71" : "#e74c3c"}
        cornerRadius={5}
      />
    </Group>
  );
}
