import { Source, GraphNode } from "./graph";
import type { Player } from "@api/player";

export class Clip {
  length = 1;
  extent = 1;
  extentPast = 0;

  start = 0;

  get totalExtent(): number {
    return this.extent - this.extentPast;
  }
}

export class ClipInstance extends Clip {
  master: Clip;
}

export class Track<T extends Source<Player>> extends GraphNode<T> {
  name = "Track name";
  description: string;
  enabled = true;
  height = 64;

  clips: Clip[] = [];
}
