import { Circle, Group, Rect } from "react-konva";
import { HealthBar } from "./HealthBar";
import Konva from "konva";

export function Player({
  playerRef,
  playerParts,
  playerHealth,
}: {
  playerRef: React.RefObject<Konva.Group | null>;
  playerParts: {
    body: boolean;
    leftArm: boolean;
    rightArm: boolean;
    leftLeg: boolean;
    rightLeg: boolean;
  };
  playerHealth: number;
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
        shadowEnabled
        shadowOpacity={1}
      />
      {playerParts.body && (
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
      )}
      {playerParts.rightArm && (
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
      )}

      {playerParts.leftArm && (
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
      )}
      {playerParts.rightLeg && (
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
      )}
      {playerParts.leftLeg && (
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
      )}

      <HealthBar bossRef={playerRef} bossHealth={playerHealth} />
    </Group>
  );
}
