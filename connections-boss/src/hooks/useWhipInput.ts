import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import type { PlayerParts } from "../types";

import whipSoundUrl from "../sounds/whip.m4a";
const whipSound = new Audio(whipSoundUrl);
whipSound.volume = 0.5;

export function useWhipInput(
  playerRef: React.RefObject<Konva.Group | null>,
  bossRef: React.RefObject<Konva.Group | null>,
  playerParts: PlayerParts,
  playSound: (audioRef: HTMLAudioElement) => void,
) {
  const tetherRef = useRef<Konva.Line>(null);
  const whipRef = useRef(0);
  const isWhipping = useRef(false);
  const whipId = useRef(0);
  const strikeDir = useRef({ x: 0, y: 0 });
  const lastWhipAt = useRef(0);
  const [cooldownRatio, setCooldownRatio] = useState(0);

  const whipSegments = useRef(
    new Array(10).fill(null).map(() => ({ x: 0, y: 0 })),
  );

  useEffect(() => {
    const handleWhip = () => {
      const now = Date.now();
      if (now - lastWhipAt.current < 1000) return;
      if (!playerRef.current || !bossRef.current) return;
      lastWhipAt.current = now;
      const dx = bossRef.current.x() - playerRef.current.x();
      const dy = bossRef.current.y() - playerRef.current.y();
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;

      strikeDir.current = {
        x: dx / distance,
        y: dy / distance,
      };

      whipId.current += 1;
      isWhipping.current = true;
      whipRef.current = 20;

      if (playerParts.rightArm && playerParts.leftArm) {
        whipRef.current = 100;
      } else if (playerParts.rightArm || playerParts.leftArm) {
        whipRef.current = 50;
      }

      playSound(whipSound);
      setTimeout(() => (isWhipping.current = false), 300);
    };

    window.addEventListener("mousedown", handleWhip);

    return () => window.removeEventListener("mousedown", handleWhip);
  }, [playerRef, bossRef, playerParts]);

  useEffect(() => {
    let frameId: number;
    const tick = () => {
      const remaining = Math.max(0, 1000 - (Date.now() - lastWhipAt.current));
      setCooldownRatio(remaining / 1000);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return {
    tetherRef,
    whipSegments,
    whipRef,
    isWhipping,
    strikeDir,
    whipId,
    cooldownRatio,
  };
}
