import { ParameterAccuracy, ParameterType, Source, Track } from "@api/graph";

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
  volume = 1.0;
  pan = 0.0;

  constructor() {
    super({
      effect: new AudioPlayer(),
    });
  }
}
