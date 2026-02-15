import { useRef, useEffect } from "react";
import type { PlayerParts } from "./types";

export function usePlayerMovement({
  playerParts,
}: {
  playerParts: PlayerParts;
}) {
  const validKeys = ["w", "a", "s", "d"];

  type GameKey = (typeof validKeys)[number];

  const playerLocation = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const knockback = useRef({ x: 0, y: 0 });
  const currentKeys: React.RefObject<Partial<Record<GameKey, boolean>>> =
    useRef({});
  let acceleration: number = 0.2;
  const friction: number = 0.9;
  const dashPower: number = 25;

  const playerWidth = 20;
  const playerHeight = 80;

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase() as GameKey;

      if (validKeys.includes(k)) {
        currentKeys.current[k] = true;
      }
    };

    const handleUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase() as GameKey;

      if (validKeys.includes(k)) {
        currentKeys.current[k] = false;
      }
    };

    window.addEventListener("keydown", handleDown);

    window.addEventListener("keyup", handleUp);

    return () => {
      window.removeEventListener("keydown", handleDown);

      window.removeEventListener("keyup", handleUp);
    };
  }, []);

  const applyKnockback = (vx: number, vy: number) => {
    knockback.current = { x: vx, y: vy };
  };

  const update = () => {
    const keys = currentKeys.current;

    if (keys === null) return;

    if (playerParts.leftLeg && playerParts.rightLeg) {
      acceleration = 0.8;
    } else if (playerParts.leftLeg || playerParts.rightLeg) {
      acceleration = 0.5;
    }

    if (keys.w) velocity.current.y -= acceleration;
    if (keys.s) velocity.current.y += acceleration;
    if (keys.a) velocity.current.x -= acceleration;
    if (keys.d) velocity.current.x += acceleration;

    velocity.current.x *= friction;
    velocity.current.y *= friction;

    if (playerLocation.current.x < playerWidth) {
      playerLocation.current.x = playerWidth;
      velocity.current.x = 0;
    } else if (playerLocation.current.x > window.innerWidth - playerWidth) {
      playerLocation.current.x = window.innerWidth - playerWidth;
      velocity.current.x = 0;
    } else {
      playerLocation.current.x += velocity.current.x + knockback.current.x;
    }

    if (playerLocation.current.y < playerHeight) {
      playerLocation.current.y = playerHeight;
      velocity.current.y = 0;
    } else if (playerLocation.current.y > window.innerHeight - playerHeight) {
      playerLocation.current.y = window.innerHeight - playerHeight;
      velocity.current.y = 0;
    } else {
      playerLocation.current.y += velocity.current.y + knockback.current.y;
    }

    knockback.current.x *= 0.8;
    knockback.current.y *= 0.8;

    return {
      pos: playerLocation.current,
      vel: velocity.current,
    };
  };

  return { playerLocation, update, applyKnockback };
}
