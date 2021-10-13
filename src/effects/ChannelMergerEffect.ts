import { Effect, ParameterAccuracy, ParameterType } from "@api/graph";

export default class ChannelMergerEffect extends Effect {
  name = "Channel merger";
  inputs = 2;

  constructor() {
    super([
      {
        name: "Volume A",
        value: 0.8,
        min: 0.0,
        max: 1.0,
        type: ParameterType.Absolute,
        accuracy: ParameterAccuracy.Sample,
      },
      {
        name: "Pan A",
        value: 0.0,
        min: -1.0,
        max: 1.0,
        type: ParameterType.Relative,
        accuracy: ParameterAccuracy.Sample,
      },
      {
        name: "Volume B",
        value: 0.8,
        min: 0.0,
        max: 1.0,
        type: ParameterType.Absolute,
        accuracy: ParameterAccuracy.Sample,
      },
      {
        name: "Pan B",
        value: 0.0,
        min: -1.0,
        max: 1.0,
        type: ParameterType.Relative,
        accuracy: ParameterAccuracy.Sample,
      },
    ]);
  }
}
