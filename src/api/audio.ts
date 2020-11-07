import { Player } from "@api/player";
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

export class AudioPlayer extends Player {
  #ctx: BaseAudioContext;
  #decodedBlobs: WeakMap<Blob, AudioBuffer> = new WeakMap();

  constructor(ctx: BaseAudioContext) {
    super();

    this.#ctx = ctx;
  }

  start(start?: number, end?: number): void {
    throw new Error("Method not implemented.");
  }

  stop(): void {
    throw new Error("Method not implemented.");
  }

  get sampleRate(): number {
    return this.#ctx.sampleRate;
  }

  async decodeBlob(blob: Blob): Promise<AudioBuffer> {
    let buffer = this.#decodedBlobs.get(blob);

    if (!buffer) {
      const arrayBuffer = await blob.arrayBuffer();

      buffer = await this.#ctx.decodeAudioData(arrayBuffer);
      this.#decodedBlobs.set(blob, buffer);
    }

    return buffer;
  }
}
