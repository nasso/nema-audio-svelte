import type { Player } from "@api/player";
import { Effect, ParameterAccuracy, ParameterType, Source } from "@api/graph";
import { Clip, Track } from "@api/playlist";
import type { Project } from "@api/project";

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

export abstract class AudioEffect extends Effect {
  abstract createAudioNodes(player: AudioPlayer, outputs: ([AudioNode, number] | AudioParam)[][]): () => void;
}

export abstract class AudioSource<C extends Clip> extends Source<AudioPlayer, C> {
  abstract createAudioNodes(player: AudioPlayer, outputs: ([AudioNode, number] | AudioParam)[][]): () => void;
}

export class AudioClipPlayer extends AudioSource<AudioClip> {
  source: AudioBufferSourceNode = null;

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

  createAudioNodes(player: AudioPlayer, outputs: ([AudioNode, number] | AudioParam)[][]): () => void {
    const ctx = player.context;
    const source = ctx.createBufferSource();

    for (let out = 0; out < source.numberOfOutputs && out < outputs.length; out++) {
      const output = outputs[out];

      for (const dest of output) {
        if (dest instanceof AudioParam) {
          source.connect(dest, out);
        } else {
          source.connect(dest[0], dest[1], out);
        }
      }
    }

    this.source = source;

    return () => source.disconnect();
  }

  playClip(player: AudioPlayer, clip: AudioClip): void {
    player.decodeBlob(clip.blob).then(buffer => {
      this.source.buffer = buffer;
      this.source.start();
    });
  }
}

export class AudioTrack extends Track<AudioClip, AudioClipPlayer> {
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
  project: Project;
  loop = true;
  startCursor = 0;
  endCursor = 0;

  #ctx: BaseAudioContext;
  #decodedBlobs: WeakMap<Blob, Promise<AudioBuffer>> = new WeakMap();
  #playing = false;
  #startTime = 0;
  #timeouts: Set<number> = new Set();
  #disconnections: Set<() => void> = new Set();

  constructor(ctx: BaseAudioContext, project: Project) {
    this.#ctx = ctx;
    this.project = project;
  }

  start(start = this.startCursor, end = this.endCursor): void {
    if (this.#playing) {
      return;
    }

    this.#playing = true;
    this.#startTime = this.#ctx.currentTime - start;

    for (const track of this.project.tracks) {
      const source = track.mod;

      if (!(source instanceof AudioSource)) {
        continue;
      }

      for (let i = 0; i < track.clips.length; i++) {
        const clip = track.clips[i];

        this.#disconnections.add(source.createAudioNodes(this, [
          [
            [this.#ctx.destination, 0],
          ],
        ]));

        this.#timeouts.add(setTimeout(() => {
          source.playClip(this, clip);
        }, 1000 * (clip.start - this.currentTime)));
      }
    }
  }

  stop(): void {
    if (!this.#playing) {
      return;
    }

    this.#playing = false;
    this.#timeouts.forEach(clearTimeout);
    this.#timeouts.clear();
    this.#disconnections.forEach(disconnect => disconnect());
    this.#disconnections.clear();
  }

  set playing(value: boolean) {
    if (value) {
      this.start();
    } else {
      this.stop();
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

  get context(): BaseAudioContext {
    return this.#ctx;
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
