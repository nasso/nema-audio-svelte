import { Effect, ParameterAccuracy, ParameterType } from "@api/graph";

export default class DelayEffect extends Effect {
  name = "Delay";
  constructor() {
    super([
      {
        name: "Time",
        value: 0.0,
        min: 0.0,
        max: 1.0,
        type: ParameterType.Absolute,
        accuracy: ParameterAccuracy.Sample,
      },
      {
        name: "Offset",
        value: 0.0,
        min: 0.0,
        max: 1.0,
        type: ParameterType.Absolute,
        accuracy: ParameterAccuracy.Sample,
      },
      {
        name: "Feedback",
        value: 0.1,
        min: 0.0,
        max: 1.0,
        type: ParameterType.Absolute,
        accuracy: ParameterAccuracy.Sample,
      },
      {
        name: "Mix",
        value: 0.5,
        min: 0.0,
        max: 1.0,
        type: ParameterType.Absolute,
        accuracy: ParameterAccuracy.Sample,
      },
    ]);
  }
}
