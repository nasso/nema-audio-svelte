import type { Player } from "@api/player";
import { ParameterAccuracy, ParameterType, Source } from "@api/graph";
import { Clip, Track } from "@api/playlist";

export class AudioClip extends Clip {
  blob: Blob;

  constructor(blob: Blob, time: number, length: number, extent = length) {
    super();

    this.blob = blob;
    this.start = time;
    this.length = length;
    this.extent = extent;
  }
}

export class AudioClipPlayer extends Source {
  constructor() {
    super([
      {
        name: "Volume",
        value: 1.0,
        min: 0.0,
        max: 1.0,
        accuracy: ParameterAccuracy.Sample,
        type: ParameterType.Absolute,
      },
      {
        name: "Pan",
        value: 0.0,
        min: -1.0,
        max: 1.0,
        accuracy: ParameterAccuracy.Sample,
        type: ParameterType.Relative,
      },
    ]);
  }
}

export class AudioTrack extends Track<AudioClipPlayer> {
  description = "Audio";
  volume = 1.0;
  pan = 0.0;

  constructor() {
    super({
      effect: new AudioClipPlayer(),
    });
  }
}

export class AudioPlayer implements Player {
  loop = true;
  startCursor = 0;
  endCursor = 0;

  #ctx: BaseAudioContext;
  #decodedBlobs: WeakMap<Blob, Promise<AudioBuffer>> = new WeakMap();
  #playing = false;
  #startTime = 0;

  constructor(ctx: BaseAudioContext) {
    this.#ctx = ctx;
  }

  start(start = this.startCursor, end = this.endCursor): void {
    this.#startTime = this.#ctx.currentTime;
  }

  stop(): void {
    //
  }

  set playing(value: boolean) {
    if (this.#playing !== value) {
      this.#playing = value;

      if (this.#playing) {
        this.start();
      } else {
        this.stop();
      }
    }
  }

  get playing(): boolean {
    return this.#playing;
  }

  get sampleRate(): number {
    return this.#ctx.sampleRate;
  }

  get currentTime(): number {
    return this.#playing ? this.#ctx.currentTime - this.#startTime : this.startCursor;
  }

  decodeBlob(blob: Blob): Promise<AudioBuffer> {
    let promise = this.#decodedBlobs.get(blob);

    if (!promise) {
      promise = blob.arrayBuffer().then(buffer => this.#ctx.decodeAudioData(buffer));

      this.#decodedBlobs.set(blob, promise);
    }

    return promise;
  }
}
