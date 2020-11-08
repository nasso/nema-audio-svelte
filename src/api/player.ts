export interface Player {
  loop: boolean;
  playing: boolean;

  start(start?: number, end?: number): void;
  stop(): void;
}
