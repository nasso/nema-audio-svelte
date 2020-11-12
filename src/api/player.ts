import type { Project } from "@api/project";

export interface Player {
  loop: boolean;
  playing: boolean;
  startCursor: number;
  endCursor: number;

  start(project: Project, start?: number, end?: number): this;
  stop(): this;
  toggle(project: Project, start?: number, end?: number): this;
}
