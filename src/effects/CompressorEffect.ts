import { Effect, ParameterAccuracy, ParameterType } from "@api/graph";

export default class CompressorEffect extends Effect {
  name = "Compressor";

  constructor() {
    super([
      {
        name: "Threshold",
        value: 0.0,
        min: 0.0,
        max: 1.0,
        type: ParameterType.Absolute,
        accuracy: ParameterAccuracy.Sample,
      },
      {
        name: "Knee",
        value: 0.0,
        min: 0.0,
        max: 1.0,
        type: ParameterType.Absolute,
        accuracy: ParameterAccuracy.Sample,
      },
      {
        name: "Ratio",
        value: 0.0,
        min: 0.0,
        max: 1.0,
        type: ParameterType.Absolute,
        accuracy: ParameterAccuracy.Sample,
      },
      {
        name: "Reduction",
        value: 0.0,
        min: 0.0,
        max: 1.0,
        type: ParameterType.Absolute,
        accuracy: ParameterAccuracy.Sample,
      },
      {
        name: "Attack",
        value: 0.0,
        min: 0.0,
        max: 1.0,
        type: ParameterType.Absolute,
        accuracy: ParameterAccuracy.Sample,
      },
      {
        name: "Release",
        value: 0.0,
        min: 0.0,
        max: 1.0,
        type: ParameterType.Absolute,
        accuracy: ParameterAccuracy.Sample,
      },
    ]);
  }
}
