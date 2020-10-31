import { AudioModule, ParameterRange } from "@api/graph";

export default class GainModule extends AudioModule {
  name = "Gain";
  constructor() {
    super([
      {
        name: "Gain",
        type: ParameterRange.Relative,
        value: 1.0,
        min: -2,
        max: 2,
      },
    ]);
  }
}
