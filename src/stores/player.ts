import { writable } from "svelte/store";
import { AudioPlayer } from "@api/audio";

const context = new AudioContext();

const player = new AudioPlayer(context);

const store = writable(player);

export default store;
