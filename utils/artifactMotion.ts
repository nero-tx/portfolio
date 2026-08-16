export type ArtifactMotionState = {
  x: number;
  y: number;
  z: number;
  rotY: number;
  scale: number;
  coreReveal: number;
};

export const defaultArtifactMotion: ArtifactMotionState = {
  x: 0,
  y: -0.35,
  z: 0,
  rotY: 0,
  scale: 1,
  coreReveal: 0,
};

export type CameraMotionState = {
  x: number;
  y: number;
  z: number;
  fov: number;
};

export const defaultCameraMotion: CameraMotionState = {
  x: 0,
  y: 0.15,
  z: 7.5,
  fov: 32,
};
