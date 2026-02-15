import { Layer, Rect, Text } from "react-konva";

type StartScreenProps = {
  width: number;
  height: number;
  difficulty: "easy" | "hard";
  onSelect: (difficulty: "easy" | "hard") => void;
};

export function StartScreen({
  width,
  height,
  difficulty,
  onSelect,
}: StartScreenProps) {
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
        text="Connections Boss"
        x={0}
        y={height * 0.4}
        width={width}
        align="center"
        fontSize={42}
        fill="#ffffff"
        listening={false}
      />
      <Text
        text="Select Difficulty"
        x={0}
        y={height * 0.8}
        width={width}
        align="center"
        fontSize={22}
        fill="#bfe9ff"
        listening={false}
      />
      <Rect
        x={width * 0.32}
        y={height * 0.5}
        width={width * 0.18}
        height={50}
        fill={difficulty === "easy" ? "#1f8fff" : "#224"}
        cornerRadius={8}
        onMouseDown={() => onSelect("easy")}
        onTap={() => onSelect("easy")}
      />
      <Text
        text="Easy"
        x={width * 0.32}
        y={height * 0.5 + 12}
        width={width * 0.18}
        align="center"
        fontSize={20}
        fill="#ffffff"
        listening={false}
      />
      <Rect
        x={width * 0.5}
        y={height * 0.5}
        width={width * 0.18}
        height={50}
        fill={difficulty === "hard" ? "#ff4a4a" : "#422"}
        cornerRadius={8}
        onMouseDown={() => onSelect("hard")}
        onTap={() => onSelect("hard")}
      />
      <Text
        text="Hard"
        x={width * 0.5}
        y={height * 0.5 + 12}
        width={width * 0.18}
        align="center"
        fontSize={20}
        fill="#ffffff"
        listening={false}
      />
    </Layer>
  );
}
