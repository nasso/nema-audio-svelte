import type { Player } from "@api/player";
import type { Clip } from "@api/timeline";

let lastNodeId = 0;

export enum ParameterType {
  Absolute = "absolute",
  Relative = "relative",
}

export enum ParameterAccuracy {
  Sample = "a-rate",
  Buffer = "k-rate",
}

export interface Parameter {
  name: string;
  value: number;
  type: ParameterType;
  accuracy: ParameterAccuracy;
  min: number;
  max: number;
}

export abstract class Effect {
  name: string;
  outputs = 1;
  inputs = 1;

  parameters: Parameter[];

  constructor(parameters: Parameter[]) {
    this.parameters = parameters;
  }
}

export interface SourceScheduler {
  playClip(clip: Clip, when?: number, offset?: number): void;
  stop(): void;
}

export abstract class Source<P extends Player> extends Effect {
  inputs = 0;

  constructor(parameters: Parameter[]) {
    super(parameters);
  }

  abstract canPlay(clip: Clip): boolean;
  abstract createScheduler(player: P): SourceScheduler;
}

export interface Output<T extends Effect> {
  node: GraphNode<T>;
  output: number;
}

export interface GraphNodeOptions<T> {
    effect: T,
    x?: number,
    y?: number,
    enabled?: boolean,
    passthrough?: boolean,
}

export class GraphNode<T extends Effect> {
  id: number = ++lastNodeId;

  mod: T;
  inputs: Map<number, Output<Effect>> = new Map();
  x: number;
  y: number;
  enabled: boolean;
  passthrough: boolean;

  constructor(options: GraphNodeOptions<T>) {
    options = Object.assign({}, {
      x: 0,
      y: 0,
      enabled: true,
      passthrough: false,
    }, options);

    this.mod = options.effect;
    this.x = options.x;
    this.y = options.y;
    this.enabled = options.enabled;
    this.passthrough = options.passthrough;
  }

  connect(dest: GraphNode<Effect>, input = 0, output = 0): this {
    dest.connectInput(input, { node: this, output });

    return this;
  }

  disconnect(dest: GraphNode<Effect>, input = 0, output?: number): this {
    const connected = dest.inputs.get(input);

    if (connected.node !== this) {
      return this;
    }

    if (typeof output === "number" && connected.output !== output) {
      return this;
    }

    dest.disconnectInput(input);

    return this;
  }

  connectInput(input: number, output: Output<Effect>): this {
    this.inputs.set(input, output);

    return this;
  }

  disconnectInput(input: number): this {
    this.inputs.delete(input);

    return this;
  }
}

export class ProcessingGraph {
  nodes: Set<GraphNode<Effect>> = new Set([]);

  deleteNode(node: GraphNode<Effect>): this {
    this.nodes.delete(node);

    // Disconnect all nodes that were connected to this node
    this.nodes.forEach((other) => {
      other.inputs.forEach((output, input) => {
        if (output.node === node) {
          other.disconnectInput(input);
        }
      });
    });

    return this;
  }
}
