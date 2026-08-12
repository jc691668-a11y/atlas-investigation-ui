import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile('public/index.html','utf8');
const app=await readFile('public/app.js','utf8');
const manifest=JSON.parse(await readFile('public/data/lidar_case1_frozen_v0.1.0/manifest.json'));

test('Atlas V3 keeps all eight product navigation destinations',()=>{
  const items=['Runtime Overview','Datasets','Evidence Packs','Investigations','Historical RGA','Sensor Engagement','Assist Vault','CTO Dashboard'];
  for(const item of items)assert.ok(html.includes(`>${item}<`),`missing navigation item: ${item}`);
  assert.equal((html.match(/data-page=/g)||[]).length,8);
});

test('Atlas V3 keeps the ten-stage investigation lifecycle',()=>{
  const lifecycle='Dataset → EP → REF → RGA → Context → Tier → EGP → IR/LL → Closure → Vault';
  assert.ok(app.includes(lifecycle));
  for(const stage of ['dataset','ep','ref','rga','context','tier','egp','results','closure','vault'])assert.ok(app.includes(`['${stage}'`));
});

test('Atlas V3 keeps queue, lifecycle workspace, and Assist columns',()=>{
  for(const column of ['queue','workspace','assist'])assert.ok(html.includes(`data-layout-column="${column}"`));
  assert.match(html,/REF INVESTIGATION QUEUE/);
  assert.match(html,/ATLAS INVESTIGATION ASSIST/);
  assert.match(html,/id="investigation-chain"/);
});

test('frozen artifact count, manifest version, and SHA-256 are presented',()=>{
  assert.equal(manifest.artifact_count,14);
  assert.equal(manifest.baseline_version,'v0.1.0');
  assert.match(manifest.ui_snapshot.sha256,/^[a-f0-9]{64}$/);
  for(const binding of ['manifest.source_artifacts','manifest.baseline_version','manifest.ui_snapshot.sha256','14 frozen artifacts'])assert.ok(app.includes(binding),`missing UI binding: ${binding}`);
  assert.match(html,/id="provenance-drawer"/);
});
