import { ParameterAccuracy, ParameterType, Source } from "@api/graph";
import { Clip, Track } from "@api/playlist";

export class AudioClip extends Clip {
  constructor(time: number, length: number, extent = length) {
    super();

    this.start = time;
    this.length = length;
    this.extent = extent;
  }
}

export class AudioPlayer extends Source {
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

export class AudioTrack extends Track<AudioPlayer> {
  description = "Audio";
  volume = 1.0;
  pan = 0.0;

  constructor() {
    super({
      effect: new AudioPlayer(),
    });
  }
}
