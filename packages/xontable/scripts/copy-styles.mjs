import { mkdirSync, copyFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const src = resolve("src/styles/xontable.css");
const dest = resolve("dist/styles/xontable.css");
mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
