import { AudioPlayer } from "@api/audio";
import project from "@app/stores/project";
import { get, writable } from "svelte/store";

const player = new AudioPlayer(new AudioContext(), get(project));

export default writable(player);
