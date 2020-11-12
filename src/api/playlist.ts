import { Source, GraphNode } from "./graph";
import type { Player } from "@api/player";

export abstract class Clip {
  name: string;
  length = 1;
  extent = 1;
  extentPast = 0;

  start = 0;

  constructor(name: string) {
    this.name = name;
  }

  get totalExtent(): number {
    return this.extent - this.extentPast;
  }

  abstract duplicate(): Clip;
}

export class AbstractClip extends Clip {
  constructor(name = "") {
    super(name);
  }

  duplicate(): Clip {
    const clip = new AbstractClip();
    clip.length = this.length;
    clip.extent = this.extent;
    clip.extentPast = this.extentPast;
    clip.start = this.start;

    return clip;
  }
}

export class Track<T extends Source<Player>> extends GraphNode<T> {
  name = "Track name";
  description: string;
  enabled = true;
  height = 64;

  clips: Clip[] = [];
}
