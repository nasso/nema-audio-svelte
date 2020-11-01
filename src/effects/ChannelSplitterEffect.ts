import { Effect } from "@api/graph";

export default class ChannelSplitterEffect extends Effect {
  name = "Channel splitter";
  outputs = 2;

  constructor() {
    super([]);
  }
}
