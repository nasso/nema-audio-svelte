import type { Parameter } from "./graph";
import { AudioModule } from "./graph";

export default class DelayModule extends AudioModule {
  name = "Delay";
  parameters: Parameter[] = [
    {
      name: "Time",
    },
    {
      name: "Offset",
    },
    {
      name: "Feedback",
      value: 0.3,
    },
    {
      name: "Mix",
      value: 0.5,
    },
  ];
}
