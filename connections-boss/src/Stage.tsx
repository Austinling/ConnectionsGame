import { useEffect, useState, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
import { usePlayerMovement } from "./PlayerMovement";
import { Player } from "./Player";
import { Boss } from "./Boss";
import Konva from "konva";
import { useBossMovement } from "./BossMovement";

export function StageBackground() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [playerParts, setPlayerParts] = useState({
    body: false,
    leftArm: false,
    rightArm: false,
    leftLeg: false,
    rightLeg: false,
  });

  const [bossHealth, setBossHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [isConnected, setIsConnected] = useState(true);
  const { playerLocation, update } = usePlayerMovement();
  const playerRef = useRef<Konva.Group>(null);
  const bossRef = useRef<Konva.Group>(null);
  const tetherRef = useRef<Konva.Line>(null);
  const whipRef = useRef(0);
  const isWhipping = useRef(false);
  const strikeDir = useRef({ x: 0, y: 0 });
  const whipSegments = useRef(
    new Array(10).fill(null).map(() => ({ x: 0, y: 0 })),
  );
  const { bossUpdate } = useBossMovement({
    playerLocation: playerRef,
    setPlayerHealth: setPlayerHealth,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleWhip = () => {
      if (!playerRef.current || !bossRef.current) return;
      const dx = bossRef.current.x() - playerRef.current.x();
      const dy = bossRef.current.y() - playerRef.current.y();
      const distance = Math.sqrt(dx * dx + dy * dy);

      strikeDir.current = {
        x: dx / distance,
        y: dy / distance,
      };

      isWhipping.current = true;
      whipRef.current = 50;

      setTimeout(() => (isWhipping.current = false), 300);
    };

    window.addEventListener("mousedown", handleWhip);

    return () => window.removeEventListener("mousedown", handleWhip);
  }, []);

  useEffect(() => {
    let frameId: number;

    const loop = () => {
      const newPos = update();

      const bossPos = bossUpdate(bossHealth);

      const children = playerRef.current?.getChildren();

      if (bossRef.current && bossPos) {
        bossRef.current.x(bossPos.x);
        bossRef.current.y(bossPos.y);
      }

      if (playerRef.current && newPos) {
        playerRef.current.x(newPos.pos.x);
        playerRef.current.y(newPos.pos.y);

        const speed = 0.005;
        const range = 5;

        const time = Date.now() * speed;

        children?.forEach((child, index) => {
          const actualChild = child as Konva.Node;
          const bob = Math.sin(time + index * 0.8) * range;
          const initialY = actualChild.getAttr("initialY");

          if (typeof initialY === "number") {
            const bob = Math.sin(time + index * 0.8) * range;
            actualChild.y(initialY + bob);
          }
        });
      }

      if (tetherRef.current && playerRef.current) {
        const p = playerRef.current;

        const segments = whipSegments.current;

        segments[0] = { x: p.x(), y: p.y() };

        for (let i = 1; i < segments.length; i++) {
          const prev = segments[i - 1];
          const curr = segments[i];

          const dx = prev.x - curr.x;
          const dy = prev.y - curr.y;

          const followStrength = isWhipping.current ? 0.8 : 0.2;
          const gravity = isWhipping.current ? 0 : 0.6;

          curr.x += dx * followStrength;
          curr.y += dy * followStrength + gravity;

          if (isWhipping.current) {
            const power = whipRef.current * (i / 10);

            curr.x += strikeDir.current.x * power;
            curr.y += strikeDir.current.y * power;
          }
        }

        const flatPoints = segments.flatMap((s) => [s.x, s.y]);
        tetherRef.current.points(flatPoints);
        whipRef.current *= 0.8;

        const tip = segments[segments.length - 1];
        if (bossRef.current) {
          const b = bossRef.current;
          const dx = tip.x - b.x();
          const dy = tip.y - b.y();
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 50 && isWhipping.current) {
            setBossHealth((prev) => prev - 1);
            tetherRef.current.stroke("#fff");
          } else {
            tetherRef.current.stroke("#00f2ff");
          }
        }
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId);
  }, [update, bossUpdate, isWhipping]);

  return (
    <Stage width={size.width} height={size.height}>
      <Layer>
        <Line
          ref={tetherRef}
          strokeWidth={3}
          stroke="#00f2ff"
          dash={[15, 10]}
          shadowBlur={10}
          lineCap="round"
          tension={0.5}
        />
        <Player
          playerHealth={playerHealth}
          playerParts={playerParts}
          playerRef={playerRef}
        />
        <Boss bossHealth={bossHealth} bossRef={bossRef} />
      </Layer>
    </Stage>
  );
}
