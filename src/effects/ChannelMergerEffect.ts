import { Effect } from "@api/graph";

export default class ChannelMergerEffect extends Effect {
  name = "Channel merger";
  inputs = 2;

  constructor() {
    super([]);
  }
}
