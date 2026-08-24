import { copyFile, mkdir } from "node:fs/promises";

await mkdir("dist/server", { recursive: true });
await copyFile("dist/poliport_nakliyeci_portali/index.js", "dist/server/index.js");
await copyFile("dist/poliport_nakliyeci_portali/wrangler.json", "dist/server/wrangler.json");
