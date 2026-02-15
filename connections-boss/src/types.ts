export type PlayerParts = {
  body: boolean;
  leftArm: boolean;
  rightArm: boolean;
  leftLeg: boolean;
  rightLeg: boolean;
};

export type PlayerPartKey = keyof PlayerParts;

export type HealthPacks = {
  id: number;
  x: number;
  y: number;
};

export type DroppedItem = {
  x: number;
  y: number;
  id: number;
  type: PlayerPartKey;
};

export type Bullet = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export type LavaPit = {
  id: number;
  x: number;
  y: number;
};
