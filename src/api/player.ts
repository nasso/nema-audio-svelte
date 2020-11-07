export abstract class Player {
  loop = true;

  abstract start(start?: number, end?: number): void;
  abstract stop(): void;
}
