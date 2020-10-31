import { AudioModule, Parameter } from "@api/graph";

export default class DemoModule extends AudioModule {
  constructor(name: string, parameters: Parameter[]) {
    super(parameters);

    this.name = name;
  }
}
