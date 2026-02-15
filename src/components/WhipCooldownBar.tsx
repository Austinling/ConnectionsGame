import { Layer, Rect, Text } from "react-konva";

type WhipCooldownBarProps = {
  width: number;
  height: number;
  cooldownRatio: number;
};

export function WhipCooldownBar({
  width,
  height,
  cooldownRatio,
}: WhipCooldownBarProps) {
  const barWidth = width * 0.3;
  const barX = width * 0.35;
  const barY = height - 40;

  return (
    <Layer listening={false}>
      <Rect
        x={barX}
        y={barY}
        width={barWidth}
        height={12}
        fill="#0b1a24"
        opacity={0.8}
        cornerRadius={6}
      />
      <Rect
        x={barX}
        y={barY}
        width={barWidth * (1 - cooldownRatio)}
        height={12}
        fill="#36c2ff"
        cornerRadius={6}
      />
      <Text
        text="Whip"
        x={barX}
        y={barY - 20}
        width={barWidth}
        align="center"
        fontSize={12}
        fill="#bfe9ff"
      />
    </Layer>
  );
}
