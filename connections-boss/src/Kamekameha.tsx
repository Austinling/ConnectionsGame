import { Line, Group } from "react-konva";
import Konva from "konva";

export function Kamekameha({
  isChargingBeam,
  isBossBeaming,
  bossRef,
  playerRef,
  lockedTarget,
}: {
  isChargingBeam: boolean;
  isBossBeaming: boolean;
  bossRef: React.RefObject<Konva.Group | null>;
  playerRef: React.RefObject<Konva.Group | null>;
  lockedTarget: React.RefObject<{ x: number; y: number }>;
}) {
  return (
    <>
      {isChargingBeam && (
        <Line
          points={[
            bossRef.current!.x(),
            bossRef.current!.y(),
            playerRef.current!.x(),
            playerRef.current!.y(),
          ]}
          stroke="red"
          strokeWidth={1}
          dash={[5, 5]}
          opacity={0.5}
        />
      )}

      {isBossBeaming && (
        <Group>
          <Line
            points={[
              bossRef.current!.x(),
              bossRef.current!.y(),
              lockedTarget.current.x,
              lockedTarget.current.y,
            ]}
            stroke="#ff0044"
            strokeWidth={50}
            opacity={0.8}
            shadowBlur={30}
            shadowColor="red"
          />
          <Line
            points={[
              bossRef.current!.x(),
              bossRef.current!.y(),
              lockedTarget.current.x,
              lockedTarget.current.y,
            ]}
            stroke="white"
            strokeWidth={10}
          />
        </Group>
      )}
    </>
  );
}
