let lastNodeId = 0;

export enum ParameterRange {
  Absolute = "absolute",
  Relative = "relative",
}

export enum ParameterAccuracy {
  Sample = "a-rate",
  Buffer = "k-rate",
}

export interface Parameter {
  name: string;
  value?: number;
  type?: ParameterRange;
  accuracy?: ParameterAccuracy;
  min?: number;
  max?: number;
}

export const PARAMETER_DEFAULT = {
  value: 0.0,
  type: ParameterRange.Absolute,
  accuracy: ParameterAccuracy.Sample,
  min: 0.0,
  max: 1.0,
};

export class AudioModule {
  name: string;
  inputs = 1;
  outputs = 1;

  #params: ReadonlyArray<Parameter>;

  constructor(parameters: Parameter[]) {
    this.#params = parameters.map(param => Object.assign({}, PARAMETER_DEFAULT, param));
  }

  get parameters(): ReadonlyArray<Parameter> {
    return this.#params;
  }
}

export interface NodeOutput {
  node: GraphNode;
  output: number;
}

export class GraphNode {
  inputs: Map<number, NodeOutput> = new Map();

  connect(dest: GraphNode, input = 0, output = 0): this {
    dest.inputs.set(input, { node: this, output });

    return this;
  }
}

export class AudioGraphNode extends GraphNode {
  id: number = ++lastNodeId;

  // from options
  mod: AudioModule;
  enabled: boolean;
  passthrough: boolean;
  x: number;
  y: number;

  constructor(options: {
    mod: AudioModule;
    enabled?: boolean;
    passthrough?: boolean;
    x?: number;
    y?: number;
  }) {
    super();

    const params = Object.assign({
      enabled: true,
      passthrough: false,
      x: 0,
      y: 0,
    }, options);

    this.mod = params.mod;
    this.enabled = params.enabled;
    this.passthrough = params.passthrough;
    this.x = params.x;
    this.y = params.y;
  }
}

export class AudioGraph {
  nodes: Set<AudioGraphNode> = new Set([]);
}
