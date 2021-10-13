import { Effect, ParameterAccuracy, ParameterType } from "@api/graph";

export default class OutputEffect extends Effect {
  name = "Output";
  outputs = 0;

  constructor() {
    super([
      {
        name: "Volume",
        value: 1.0,
        min: 0.0,
        max: 1.2,
        type: ParameterType.Absolute,
        accuracy: ParameterAccuracy.Sample,
      },
      {
        name: "Pan",
        value: 0.0,
        min: -1.0,
        max: 1.0,
        type: ParameterType.Relative,
        accuracy: ParameterAccuracy.Sample,
      },
    ]);
  }
}
