import { useCallback, useRef } from "react";
import Konva from "konva";

export function useBossMovement({
  playerLocation,
  setPlayerHealth,
}: {
  playerLocation: React.RefObject<Konva.Group | null>;
  setPlayerHealth: React.Dispatch<React.SetStateAction<number>>;
}) {
  const bossLocation = useRef({
    x: window.innerWidth,
    y: window.innerHeight / 2,
  });

  const bossUpdate = useCallback(
    (health: number) => {
      if (!playerLocation.current) return;

      const playerX = playerLocation.current.x();
      const playerY = playerLocation.current.y();

      const bossLocationX = bossLocation.current.x;
      const bossLocationY = bossLocation.current.y;

      const dX = playerX - bossLocationX;
      const dY = playerY - bossLocationY;

      const distance = Math.sqrt(dX * dX + dY * dY);

      if (distance > 10) {
        let speed = 1.3;

        if (health < 40) {
          speed = 3;
        } else if (health < 70) {
          speed = 2;
        }

        const vx = (dX / distance) * speed;
        const vy = (dY / distance) * speed;

        bossLocation.current.x += vx;
        bossLocation.current.y += vy;
      } else {
        setPlayerHealth((prev) => Math.max(0, prev - 0.5));
      }

      return bossLocation.current;
    },
    [playerLocation],
  );

  return { bossUpdate };
}
