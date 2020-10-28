import type { Parameter } from "./graph";
import { AudioModule } from "./graph";

export default class CompressorModule extends AudioModule {
  name = "Compressor";
  parameters: Parameter[] = [
    {
      name: "Threshold",
    },
    {
      name: "Knee",
    },
    {
      name: "Ratio",
    },
    {
      name: "Reduction",
    },
    {
      name: "Attack",
    },
    {
      name: "Release",
    },
  ];
}