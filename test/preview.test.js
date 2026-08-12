import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("static preview clearly disclaims demo data and disables runner", async () => {
  const html = await readFile("public/index.html", "utf8");
  assert.match(html, /Preview Mode/);
  assert.match(html, /UI DEMO DATA — NOT A REAL BASELINE RESULT/);
  assert.match(html, /Local Atlas Runner not connected/);
  assert.match(html, /id="run" disabled/);
  assert.doesNotMatch(html, />PASS</);
});

test("Vercel publishes the static build output", async () => {
  const config = JSON.parse(await readFile("vercel.json", "utf8"));
  assert.equal(config.buildCommand, "npm run build");
  assert.equal(config.outputDirectory, "dist");
});
