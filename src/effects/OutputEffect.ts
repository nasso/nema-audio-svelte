import { Effect } from "@api/graph";

export default class OutputEffect extends Effect {
  name = "Output (speakers)";
  outputs = 0;

  constructor() {
    super([]);
  }
}
