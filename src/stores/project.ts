import { Project } from "@api/project";
import { writable } from "svelte/store";

const project = writable(new Project());

export default project;
