import { writable, Writable } from "svelte/store";

import TimedSequence from "@app/utils/TimedSequence";
import { Source, GraphNode } from "./graph";

export class Clip {
  timestampStore: Writable<number>;
  length = 1;
  extent = 1;
  extentPast = 0;

  #start = 0;

  constructor() {
    this.timestampStore = writable(0);

    this.timestampStore.subscribe((val) => {
      this.#start = val;
    });
  }

  get start(): number {
    return this.#start;
  }

  set start(val: number) {
    this.timestampStore.set(val);
  }

  get totalExtent(): number {
    return this.extent - this.extentPast;
  }
}

export class ClipInstance extends Clip {
  master: Clip;
}

export class Track<T extends Source> extends GraphNode<T> {
  name = "Track name";
  description: string;
  enabled = true;
  height = 64;

  #clips: TimedSequence<Clip> = new TimedSequence();

  get clips(): ArrayLike<Clip> {
    return this.#clips.arr;
  }

  insert(clip: Clip): this {
    this.#clips.insert(clip);

    return this;
  }

  remove(clip: Clip): this {
    this.#clips.remove(clip);

    return this;
  }
}
