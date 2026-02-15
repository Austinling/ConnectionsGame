import { Layer, Rect, Circle } from "react-konva";

type StageBackgroundLayerProps = {
  width: number;
  height: number;
};

export function StageBackgroundLayer({
  width,
  height,
}: StageBackgroundLayerProps) {
  return (
    <Layer listening={false}>
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: width, y: height }}
        fillLinearGradientColorStops={[
          0,
          "#0a0f1f",
          0.5,
          "#0b2033",
          1,
          "#1a0c2b",
        ]}
      />
      <Circle
        x={width * 0.2}
        y={height * 0.25}
        radius={220}
        fill="#2b6cb0"
        opacity={0.12}
        shadowBlur={60}
        shadowColor="#2b6cb0"
      />
      <Circle
        x={width * 0.8}
        y={height * 0.2}
        radius={180}
        fill="#805ad5"
        opacity={0.1}
        shadowBlur={50}
        shadowColor="#805ad5"
      />
      <Circle
        x={width * 0.7}
        y={height * 0.75}
        radius={260}
        fill="#ed8936"
        opacity={0.08}
        shadowBlur={70}
        shadowColor="#ed8936"
      />
    </Layer>
  );
}
