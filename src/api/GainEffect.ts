import { Effect, ParameterAccuracy, ParameterType } from "@api/graph";

export default class GainEffect extends Effect {
  name = "Gain";
  constructor() {
    super([
      {
        name: "Gain",
        value: 1.0,
        min: -2,
        max: 2,
        type: ParameterType.Relative,
        accuracy: ParameterAccuracy.Sample,
      },
    ]);
  }
}
