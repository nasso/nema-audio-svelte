/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

import path from "path";
import svelte from "rollup-plugin-svelte";
import alias from "@rollup/plugin-alias";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";

const production = !process.env.ROLLUP_WATCH;

const projectDir = path.resolve(__dirname);
const srcDir = path.resolve(projectDir, "src");

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true,
      });

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  input: "src/main.ts",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  onwarn(warning, rollupWarn) {
    // Skip certain warnings
    switch(warning.code) {
    case "THIS_IS_UNDEFINED":
      return;
    case "CIRCULAR_DEPENDENCY":
      if (["semver"].some(d => warning.importer.includes(d))) {
        return;
      }
      // fall through
    default:
      rollupWarn(warning);
    }
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: css => {
        css.write("bundle.css");
      },
      preprocess: sveltePreprocess({
        sourceMap: !production,
        scss: {
          importer(url) {
            return {
              file: url.replace("@app", srcDir),
            };
          },
        },
      }),
    }),

    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),

    alias({
      entries: [
        {
          find: "@api",
          replacement: path.resolve(srcDir, "api"),
        },
        {
          find: "@components",
          replacement: path.resolve(srcDir, "components"),
        },
        {
          find: "@app",
          replacement: srcDir,
        },
      ],
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
