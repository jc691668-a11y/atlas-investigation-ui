import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const pxSizes=css=>[...css.matchAll(/font(?:-size)?\s*:\s*([0-9.]+)px/g)].map(match=>Number(match[1]));

test("desktop typography never declares user-visible text below 11px",async()=>{
  const css=await readFile("public/styles.css","utf8");
  const sizes=pxSizes(css);
  assert.ok(sizes.length,"expected explicit typography rules");
  assert.ok(sizes.every(size=>size>=11),`found undersized font declarations: ${sizes.filter(size=>size<11)}`);
});

test("desktop layout reserves readable rails and scrolls the lifecycle",async()=>{
  const css=await readFile("public/styles.css","utf8");
  assert.match(css,/grid-template-columns:\s*minmax\(280px,[^)]+\)\s+minmax\(0,\s*1fr\)\s+minmax\(320px,/);
  assert.match(css,/\.artifact-chain\s*\{[^}]*overflow-x:\s*auto/s);
  assert.match(css,/\.chain-flow\s*\{[^}]*min-width:\s*1040px/s);
  assert.match(css,/\.workspace-head h1\s*\{[^}]*font-size:\s*26px/s);
  assert.match(css,/\.card h3\s*\{[^}]*font-size:\s*17px/s);
  assert.match(css,/\.global-nav button\s*\{[^}]*font-size:\s*13px/s);
});

test("1366px, 1440px, and 1920px share the same minimum typography baseline",async()=>{
  const css=await readFile("public/styles.css","utf8");
  assert.match(css,/@media \(max-width: 1500px\)/);
  assert.match(css,/@media \(max-width: 1380px\)/);
  assert.doesNotMatch(css,/@media[^{}]+\{[^{}]*font-size\s*:\s*(?:[0-9]|10(?:\.\d+)?)px/s);
});
