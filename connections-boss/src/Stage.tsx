import { useEffect, useState, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
import { usePlayerMovement } from "./PlayerMovement";
import { Player } from "./Player";
import { Boss } from "./Boss";
import Konva from "konva";
import { useBossMovement } from "./BossMovement";
import { Bullets } from "./components/Bullets";
import { DroppedItems } from "./components/DroppedItems";
import { LavaPits } from "./components/LavaPits";
import { StageBackgroundLayer } from "./components/StageBackgroundLayer";
import { StartScreen } from "./components/StartScreen";
import { EndScreen } from "./components/EndScreen";
import { WhipCooldownBar } from "./components/WhipCooldownBar";
import { useStageSize } from "./hooks/useStageSize";
import { useWhipInput } from "./hooks/useWhipInput";
import type {
  Bullet,
  DroppedItem,
  LavaPit,
  PlayerPartKey,
  PlayerParts,
} from "./types";
import { HealthPacks } from "./components/HealthPacks";
import { Kamekameha } from "./Kamekameha";
import bullSoundUrl from "./sounds/bull.m4a";
import kamekamehaSoundUrl from "./sounds/kamekameha.m4a";
import loseSoundUrl from "./sounds/lose.m4a";
import spawnSoundUrl from "./sounds/spawn.m4a";
import volcanoSoundUrl from "./sounds/volcano.m4a";
import winSoundUrl from "./sounds/win.m4a";
import yellSoundUrl from "./sounds/yell.m4a";
import pewSoundUrl from "./sounds/pew.m4a";
import collectSoundUrl from "./sounds/collect.m4a";
import happySoundUrl from "./sounds/happy.m4a";

const bullSound = new Audio(bullSoundUrl);
const kamekamehaSound = new Audio(kamekamehaSoundUrl);
const loseSound = new Audio(loseSoundUrl);
const spawnSound = new Audio(spawnSoundUrl);
const volcanoSound = new Audio(volcanoSoundUrl);
const winSound = new Audio(winSoundUrl);
const yellSound = new Audio(yellSoundUrl);
const pewSound = new Audio(pewSoundUrl);
const collectSound = new Audio(collectSoundUrl);
const happySound = new Audio(happySoundUrl);

export function StageBackground() {
  const size = useStageSize();

  const [gamePhase, setGamePhase] = useState<
    "start" | "playing" | "won" | "lost"
  >("start");
  const [difficulty, setDifficulty] = useState<"easy" | "hard">("easy");

  const [playerParts, setPlayerParts] = useState<PlayerParts>({
    body: false,
    leftArm: false,
    rightArm: false,
    leftLeg: false,
    rightLeg: false,
  });

  const handleStart = (mode: "easy" | "hard") => {
    setDifficulty(mode);
    setGamePhase("playing");
    playSound(happySound);
  };

  const playSound = (audioRef: HTMLAudioElement) => {
    audioRef.currentTime = 0;

    audioRef.volume = 0.5;
    audioRef.play().catch(() => {});
  };

  const [bossHealth, setBossHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const setPlayerHealthWithSound: React.Dispatch<
    React.SetStateAction<number>
  > = (action) => {
    setPlayerHealth((prev) => {
      const next = typeof action === "function" ? action(prev) : action;
      if (next < prev) {
        playSound(yellSound);
      }
      return next;
    });
  };
  const [isConnected, setIsConnected] = useState(true);
  const [healthPacks, setHealthPacks] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const lastHealthSpawn = useRef(0);
  const { applyKnockback, update } = usePlayerMovement({ playerParts });
  const playerRef = useRef<Konva.Group>(null);
  const bossRef = useRef<Konva.Group>(null);
  const {
    tetherRef,
    whipSegments,
    whipRef,
    isWhipping,
    strikeDir,
    whipId,
    cooldownRatio,
  } = useWhipInput(playerRef, bossRef, playerParts, playSound);
  const lastWhipHitId = useRef(0);
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [isBossBeaming, setIsBossBeaming] = useState(false);
  const [isChargingBeam, setIsChargingBeam] = useState(false);
  const lockedTarget = useRef({ x: 0, y: 0 });
  const lastPewAt = useRef(0);
  const lastBeamDamageAt = useRef(0);

  const { bossUpdate } = useBossMovement({
    playerLocation: playerRef,
    setPlayerHealth: setPlayerHealthWithSound,
    applyKnockback: applyKnockback,
    setIsBossBeaming: setIsBossBeaming,
    setIsChargingBeam: setIsChargingBeam,
    lockedTarget: lockedTarget,
    onBullCharge: () => playSound(bullSound),
    difficulty: difficulty,
  });

  const [lavaPits, setLavaPits] = useState<LavaPit[]>([]);
  const lastLavaSpawn = useRef(0);

  const damageMulti = playerParts.body ? 2 : 1;

  const mileStonesReached = useRef<Set<number>>(new Set<number>());

  useEffect(() => {
    if (gamePhase === "playing" && bossHealth <= 0) {
      setBossHealth(0);
      setGamePhase("won");
      playSound(winSound);
    }
  }, [bossHealth, gamePhase]);

  useEffect(() => {
    if (gamePhase === "playing" && playerHealth <= 0) {
      setPlayerHealth(0);
      setGamePhase("lost");
      playSound(loseSound);
    }
  }, [gamePhase, playerHealth]);

  useEffect(() => {
    if (isChargingBeam || isBossBeaming) {
      kamekamehaSound.play().catch(() => {});
    } else {
      kamekamehaSound.pause();
      kamekamehaSound.currentTime = 0;
    }
  }, [isChargingBeam, isBossBeaming]);

  useEffect(() => {
    let frameId: number;

    const loop = () => {
      if (gamePhase !== "playing") {
        frameId = requestAnimationFrame(loop);
        return;
      }

      const newPos = update();

      const bossPos = bossUpdate(bossHealth);

      const children = playerRef.current?.getChildren();

      if (bossRef.current && bossPos) {
        bossRef.current.x(bossPos.x);
        bossRef.current.y(bossPos.y);
      }

      if (isBossBeaming && bossRef.current && playerRef.current) {
        const b = bossRef.current;
        const p = playerRef.current;

        const ax = b.x();
        const ay = b.y();
        const bx = lockedTarget.current.x;
        const by = lockedTarget.current.y;
        const px = p.x();
        const py = p.y();

        const abx = bx - ax;
        const aby = by - ay;
        const apx = px - ax;
        const apy = py - ay;
        const abLenSq = abx * abx + aby * aby || 1;
        const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / abLenSq));
        const cx = ax + abx * t;
        const cy = ay + aby * t;
        const dx = px - cx;
        const dy = py - cy;
        const distanceToBeam = Math.sqrt(dx * dx + dy * dy);

        const beamRadius = 25;
        const now = Date.now();
        if (
          distanceToBeam <= beamRadius &&
          now - lastBeamDamageAt.current > 150
        ) {
          lastBeamDamageAt.current = now;
          setPlayerHealthWithSound((h) => Math.max(0, h - 10));
        }
      }

      if (bossRef.current && playerRef.current) {
        const bX = bossRef.current.x();
        const bY = bossRef.current.y();
        const pX = playerRef.current.x();
        const pY = playerRef.current.y();

        const dx = pX - bX;
        const dy = pY - bY;
        const distance = Math.sqrt(dx * dx + dy * dy);
      }

      if (Date.now() > lastHealthSpawn.current + 15000) {
        playSound(spawnSound);
        const newPack = {
          id: Date.now(),
          x: Math.random() * (size.width - 50) + 25,
          y: Math.random() * (size.height - 50) + 25,
        };
        setHealthPacks((prev) => [...prev, newPack]);
        lastHealthSpawn.current = Date.now();
      }

      healthPacks.forEach((pack) => {
        const dx = playerRef.current!.x() - pack.x;
        const dy = playerRef.current!.y() - pack.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 30) {
          playSound(collectSound);
          setPlayerHealthWithSound((h) => Math.min(100, h + 20));

          setHealthPacks((prev) => prev.filter((p) => p.id !== pack.id));
          console.log("Healed!");
        }
      });

      const lavaActive =
        difficulty === "easy"
          ? bossHealth <= 40 && bossHealth > 25
          : bossHealth < 40;

      if (lavaActive && Date.now() > lastLavaSpawn.current + 1000) {
        playSound(volcanoSound);
        const newPit = {
          id: Date.now(),
          x: bossRef.current!.x(),
          y: bossRef.current!.y(),
        };
        setLavaPits((prev) => [...prev, newPit].slice(-10));
        lastLavaSpawn.current = Date.now();
      }

      lavaPits.forEach((pit) => {
        const dx = playerRef.current!.x() - pit.x;
        const dy = playerRef.current!.y() - pit.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 40) {
          setPlayerHealthWithSound((h) => Math.max(0, h - 0.5 / damageMulti));
        }
      });

      if (bossPos?.isSpraying) {
        if (Math.random() > 0.8) {
          if (Date.now() - lastPewAt.current > 150) {
            playSound(pewSound);
            lastPewAt.current = Date.now();
          }
          const angle = Date.now() * 0.005;
          const newBullet = {
            id: Math.random(),
            x: bossPos.x,
            y: bossPos.y,
            vx: Math.cos(angle) * 5,
            vy: Math.sin(angle) * 5,
          };
          setBullets((prev) => [...prev, newBullet]);
        }
      }

      setBullets((prev) =>
        prev
          .map((b) => ({
            ...b,
            x: b.x + b.vx,
            y: b.y + b.vy,
          }))
          .filter(
            (b) => b.x > 0 && b.x < size.width && b.y > 0 && b.y < size.height,
          ),
      );

      bullets.forEach((b) => {
        const dx = playerRef.current!.x() - b.x;
        const dy = playerRef.current!.y() - b.y;
        if (Math.sqrt(dx * dx + dy * dy) < 15) {
          setPlayerHealthWithSound((h) => Math.max(0, h - 2 / damageMulti));
        }
      });

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

      droppedItems.forEach((item) => {
        if (!playerRef.current) return;
        const dx = playerRef.current.x() - item.x;
        const dy = playerRef.current.y() - item.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 30) {
          playSound(collectSound);
          setPlayerParts((prev) => ({
            ...prev,
            [item.type]: true,
          }));

          setDroppedItems((prev) => prev.filter((i) => i.id !== item.id));
        }
      });

      const milestones = [85, 70, 55, 40, 25];
      const parts: PlayerPartKey[] = [
        "leftLeg",
        "rightLeg",
        "leftArm",
        "rightArm",
        "body",
      ];

      milestones.forEach((threshold, index) => {
        if (
          bossHealth <= threshold &&
          !mileStonesReached.current.has(threshold)
        ) {
          mileStonesReached.current.add(threshold);

          const newDrop = {
            id: Date.now() + index,
            x: bossRef.current?.x() || 0,
            y: bossRef.current?.y() || 0,
            type: parts[index],
          };

          setDroppedItems((prev) => [...prev, newDrop]);
        }
      });

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

          if (
            distance < 50 &&
            isWhipping.current &&
            whipId.current !== lastWhipHitId.current
          ) {
            lastWhipHitId.current = whipId.current;
            setBossHealth((prev) => Math.max(0, prev - 10));
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
  }, [update, bossUpdate, isWhipping, gamePhase]);

  return (
    <Stage width={size.width} height={size.height}>
      <StageBackgroundLayer width={size.width} height={size.height} />
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

        <Bullets bullets={bullets} />
        <DroppedItems items={droppedItems} />
        <LavaPits pits={lavaPits} />
        <HealthPacks healthPacks={healthPacks} />
        <Kamekameha
          isBossBeaming={isBossBeaming}
          isChargingBeam={isChargingBeam}
          bossRef={bossRef}
          playerRef={playerRef}
          lockedTarget={lockedTarget}
        />
      </Layer>
      {gamePhase === "playing" && (
        <WhipCooldownBar
          width={size.width}
          height={size.height}
          cooldownRatio={cooldownRatio}
        />
      )}
      {gamePhase === "start" && (
        <StartScreen
          width={size.width}
          height={size.height}
          difficulty={difficulty}
          onSelect={handleStart}
        />
      )}
      <EndScreen
        width={size.width}
        height={size.height}
        phase={gamePhase === "won" || gamePhase === "lost" ? gamePhase : null}
        bossHealth={bossHealth}
      />
    </Stage>
  );
}
