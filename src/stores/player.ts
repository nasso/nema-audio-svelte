import { writable } from "svelte/store";
import { AudioPlayer } from "@api/audio";

const context = new AudioContext();

const player = writable(new AudioPlayer(context));

export default player;
