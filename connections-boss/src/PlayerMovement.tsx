import { useRef, useEffect } from "react";

export function usePlayerMovement() {
  const validKeys = ["w", "a", "s", "d"];

  type GameKey = (typeof validKeys)[number];

  const playerLocation = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const currentKeys: React.RefObject<Partial<Record<GameKey, boolean>>> =
    useRef({});
  const acceleration: number = 0.8;
  const friction: number = 0.9;
  const dashPower: number = 25;

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

  const update = () => {
    const keys = currentKeys.current;

    if (keys === null) return;

    if (keys.w) velocity.current.y -= acceleration;
    if (keys.s) velocity.current.y += acceleration;
    if (keys.a) velocity.current.x -= acceleration;
    if (keys.d) velocity.current.x += acceleration;

    velocity.current.x *= friction;
    velocity.current.y *= friction;

    playerLocation.current.x += velocity.current.x;
    playerLocation.current.y += velocity.current.y;

    return {
      pos: playerLocation.current,
      vel: velocity.current,
    };
  };

  return { playerLocation, update };
}
