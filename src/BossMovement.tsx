import { useCallback, useRef } from "react";
import Konva from "konva";

export function useBossMovement({
  playerLocation,
  setPlayerHealth,
  applyKnockback,
  setIsBossBeaming,
  setIsChargingBeam,
  lockedTarget,
  difficulty,
}: {
  playerLocation: React.RefObject<Konva.Group | null>;
  setPlayerHealth: React.Dispatch<React.SetStateAction<number>>;
  applyKnockback: (vx: number, vy: number) => void;
  setIsBossBeaming: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChargingBeam: React.Dispatch<React.SetStateAction<boolean>>;
  lockedTarget: React.RefObject<{ x: number; y: number }>;
  onBullCharge: () => void;
  difficulty: "easy" | "hard";
}) {
  const bossLocation = useRef({
    x: window.innerWidth,
    y: window.innerHeight / 2,
  });

  const bossUpdate = useCallback(
    (health: number) => {
      if (!playerLocation.current || !bossLocation) return;

      const bX = bossLocation.current.x;
      const bY = bossLocation.current.y;
      const pX = playerLocation.current.x();
      const pY = playerLocation.current.y();
      const dX = pX - bX;
      const dY = pY - bY;
      const dist = Math.sqrt(dX * dX + dY * dY) || 1;

      let speed = 1.5;
      const now = Date.now();

      const isEasy = difficulty === "easy";
      let isSpraying = false;

      if (health > 85) {
        speed = 1.2;
      } else if (health > 70) {
        speed = Math.sin(now * 0.005) > 0.8 ? 6 : 1.5;
      } else if (health > 55) {
        isSpraying = true;
        const isCharging = Math.sin(now * 0.003) > 0.5;
        speed = isCharging ? 0 : 2.5;
      } else if (health > 40) {
        isSpraying = true;

        const wave = Math.cos(now * 0.01) * 10;
        bossLocation.current.x += (dY / dist) * wave;
        bossLocation.current.y -= (dX / dist) * wave;
        speed = Math.sin(now * 0.005) > 0.8 ? 6 : 3;
      } else if (health > 25) {
        isSpraying = true;

        const wave = Math.cos(now * 0.01) * 10;
        bossLocation.current.x += (dY / dist) * wave;
        bossLocation.current.y -= (dX / dist) * wave;
        speed = Math.tan(now * 0.001) > 2 ? 10 : 3;
      } else {
        isSpraying = true;

        speed = Math.sin(now * 0.005) > 0.8 ? 20 : 3;
      }

      if (isEasy) {
        isSpraying = health <= 70 && health > 55;
      }

      const beamAllowed = isEasy ? health <= 85 && health > 70 : health <= 85;

      if (beamAllowed) {
        const cycle = now % 10000;
        const allowBeamSpeedOverride = health > 25;

        if (cycle > 9500) {
          setIsBossBeaming(true);
          setIsChargingBeam(false);
          if (allowBeamSpeedOverride) speed = 0;
        } else if (cycle > 8000) {
          setIsChargingBeam(true);
          setIsBossBeaming(false);
          if (allowBeamSpeedOverride) speed = 0;

          lockedTarget.current = { x: pX, y: pY };
        } else if (cycle > 5000) {
          setIsChargingBeam(true);
          setIsBossBeaming(false);
          if (allowBeamSpeedOverride) speed = 1;
        } else {
          setIsBossBeaming(false);
          setIsChargingBeam(false);
          if (allowBeamSpeedOverride) speed = 1;
        }
      } else {
        setIsBossBeaming(false);
        setIsChargingBeam(false);
      }

      if (dist > 40) {
        bossLocation.current.x += (dX / dist) * speed;
        bossLocation.current.y += (dY / dist) * speed;
      } else {
        setPlayerHealth((prev) => Math.max(0, prev - 2));

        const power = 40;

        const nx = dX / dist;
        const ny = dY / dist;

        applyKnockback(nx * power, ny * power);
      }

      return { ...bossLocation.current, isSpraying };
    },
    [playerLocation],
  );

  return { bossUpdate };
}
