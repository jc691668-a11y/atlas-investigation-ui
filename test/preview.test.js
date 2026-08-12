import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("V2 preview exposes shared views and all investigation tabs", async () => {
  const html = await readFile("public/index.html", "utf8");
  for (const label of ["OEM View", "Sensor Partner View", "Shared Evidence View", "Overview", "Evidence Timeline", "Investigation Chain", "RGA Recall", "Partner Exchange", "Decisions", "Raw Details"]) assert.match(html, new RegExp(label));
  assert.match(html, /Sanitized fictional records/);
  assert.match(html, /Claim Boundary/);
  assert.match(html, /No Assist Vault write/);
});

test("V2 demo data contains three sanitized cases and WINPOL timeline", async () => {
  const app = await readFile("public/app.js", "utf8");
  assert.equal((app.match(/id:"(?:WINPOL|THERM|VISION)-/g) ?? []).length, 3);
  assert.match(app, /WINPOL-DEFAULT-001/);
  assert.match(app, /Evidence window correlated/);
  assert.match(app, /does not confirm root cause/);
  assert.match(app, /automatically close this case/);
  assert.match(app, /No external write was performed/);
});

test("Vercel publishes the static build output", async () => {
  const config = JSON.parse(await readFile("vercel.json", "utf8"));
  assert.equal(config.buildCommand, "npm run build");
  assert.equal(config.outputDirectory, "dist");
});
