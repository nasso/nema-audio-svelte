import type { Player } from "@api/player";
import type { Project } from "@api/project";
import { ParameterAccuracy, ParameterType, Source, SourceScheduler } from "@api/graph";
import { Clip, Track } from "@api/playlist";

export class AudioClip extends Clip {
  blob: Blob;

  constructor(blob: Blob, time: number, length: number, extent = length, extentPast = 0) {
    super();

    this.blob = blob;
    this.start = time;
    this.length = length;
    this.extent = extent;
    this.extentPast = extentPast;
  }
}

export interface AudioSourceScheduler extends SourceScheduler {
  connect(destination: AudioParam | AudioNode, output?: number, input?: number): void;
}

export abstract class AudioSource extends Source<AudioPlayer> {
  abstract createScheduler(player: AudioPlayer): AudioSourceScheduler;
}

export class AudioClipPlayer extends AudioSource {
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

  createScheduler(player: AudioPlayer): AudioSourceScheduler {
    const ctx = player.context;
    const outNode = ctx.createGain();
    outNode.gain.value = 1.0;

    return {
      connect(destination: AudioParam | AudioNode, output = 0, input = 0) {
        if (destination instanceof AudioParam) {
          outNode.connect(destination, output);
        } else {
          outNode.connect(destination, output, input);
        }
      },

      playClip(clip: AudioClip, when = 0, offset = 0): void {
        const duration = clip.extent - offset;
        const wrappedOffset = (offset % clip.length + clip.length) % clip.length;

        const source = ctx.createBufferSource();
        source.loop = true;

        source.connect(outNode);

        player.decodeBlob(clip.blob).then(buffer => {
          source.buffer = buffer;

          source.start(ctx.currentTime + when, wrappedOffset);
          source.stop(ctx.currentTime + when + duration);
        });
      },

      stop(): void {
        outNode.disconnect();
      },
    };
  }

  canPlay(clip: Clip): clip is AudioClip {
    return clip instanceof AudioClip;
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
  project: Project;
  loop = true;
  startCursor = 5;
  endCursor = 0;

  #ctx: BaseAudioContext;
  #decodedBlobs: WeakMap<Blob, Promise<AudioBuffer>> = new WeakMap();
  #playing = false;
  #startTime = 0;
  #runningJobs: Set<AudioSourceScheduler> = new Set();

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

      if (source instanceof AudioSource) {
        const scheduler = source.createScheduler(this);

        scheduler.connect(this.#ctx.destination);
        this.#runningJobs.add(scheduler);

        for (let i = 0; i < track.clips.length; i++) {
          const clip = track.clips[i];

          if (this.currentTime > clip.start + clip.extent) {
            continue;
          }

          let when = clip.start + clip.extentPast - this.currentTime;
          const offset = Math.max(this.currentTime - clip.start, clip.extentPast);

          when = Math.max(when, 0);

          scheduler.playClip(clip, when, offset);
        }
      }
    }
  }

  stop(): void {
    if (!this.#playing) {
      return;
    }

    this.#playing = false;
    this.#runningJobs.forEach(job => job.stop());
    this.#runningJobs.clear();
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
