import * as color from "https://deno.land/std@0.147.0/fmt/colors.ts";
import { parse } from "https://deno.land/std@0.147.0/path/mod.ts";

class DuplicateError extends Error {
  constructor() {
    super();
  }
}

const env = Deno.env.toObject();
// console.log(env);
for (const name in env) {
  const list =
    Deno.build.os === "windows" ? env[name].split(";") : env[name].split(":");
  for (const path of list) {
    const p = parse(path);
    if (!p.root) continue; // パスでないものを除外

    const list: string[] = [];

    try {
      if (list.some((item) => item === path)) throw new DuplicateError();
      await Deno.stat(path);
      list.push(path);
      // console.log(`[${name}]`, color.green("Exists"), path);
    } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
        console.log(`[${name}]`, color.red("Not found"), path);
      } else if (e instanceof DuplicateError) {
        console.log(`[${name}]`, color.yellow("Duplicate"), path);
      }
    }
  }
}
