import { Layer, Rect, Text } from "react-konva";

type EndScreenProps = {
  width: number;
  height: number;
  phase: "won" | "lost" | null;
  bossHealth: number;
};

export function EndScreen({
  width,
  height,
  phase,
  bossHealth,
}: EndScreenProps) {
  if (!phase) return null;

  if (phase === "won") {
    return (
      <Layer>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="rgba(0, 0, 0, 0.75)"
        />
        <Text
          text="You Win!"
          x={0}
          y={height * 0.42}
          width={width}
          align="center"
          fontSize={48}
          fill="#ffffff"
        />
        <Text
          text="Refresh to play again"
          x={0}
          y={height * 0.54}
          width={width}
          align="center"
          fontSize={20}
          fill="#bfe9ff"
        />
      </Layer>
    );
  }

  return (
    <Layer>
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="rgba(0, 0, 0, 0.75)"
      />
      <Text
        text="You Lost"
        x={0}
        y={height * 0.42}
        width={width}
        align="center"
        fontSize={48}
        fill="#ffffff"
      />
      <Text
        text={`Boss health: ${bossHealth}`}
        x={0}
        y={height * 0.5}
        width={width}
        align="center"
        fontSize={22}
        fill="#ffcf7a"
      />
      <Text
        text="Refresh to try again"
        x={0}
        y={height * 0.54}
        width={width}
        align="center"
        fontSize={20}
        fill="#bfe9ff"
      />
    </Layer>
  );
}
