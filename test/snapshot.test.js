import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';

const root='public/data/lidar_case1_frozen_v0.1.0';
const snapshotBytes=await readFile(`${root}/ui_snapshot.json`);
const snapshot=JSON.parse(snapshotBytes);
const manifest=JSON.parse(await readFile(`${root}/manifest.json`));

test('frozen snapshot is readable and its declared digest is valid',()=>{
  assert.equal(snapshot.snapshot_format,'atlas_ui_demo_snapshot_v1');
  assert.equal(createHash('sha256').update(snapshotBytes).digest('hex'),manifest.ui_snapshot.sha256);
});

test('all 14 artifact references are complete and uniquely represented',()=>{
  assert.equal(manifest.artifact_count,14);
  assert.equal(snapshot.artifacts.length,14);
  assert.equal(manifest.source_artifacts.length,14);
  const snapshotSources=new Set(snapshot.artifacts.map(item=>item.source_file));
  const manifestSources=new Set(manifest.source_artifacts.map(item=>item.path));
  assert.equal(snapshotSources.size,14);
  assert.deepEqual(snapshotSources,manifestSources);
  for(const source of manifest.source_artifacts){assert.match(source.sha256,/^[a-f0-9]{64}$/);assert.ok(snapshotSources.has(source.path))}
});

test('version, hash, origin, and sanitization are visible in the static UI',async()=>{
  const text=(await readFile('public/index.html','utf8'))+(await readFile('public/app.js','utf8'));
  for(const value of ['Atlas v0.1.0 frozen baseline · sanitized static demo · not live data','Atlas v0.1.0 冻结基线 · 已脱敏静态演示 · 非实时数据','Snapshot SHA-256','快照 SHA-256','source_directory','ui_snapshot.sha256','sanitization'])assert.ok(text.includes(value),`missing visible binding: ${value}`);
});

test('UI reads only the frozen files and declares the offline boundary',async()=>{
  const app=await readFile('public/app.js','utf8');
  assert.match(app,/\/data\/lidar_case1_frozen_v0\.1\.0/);
  assert.equal((app.match(/fetch\(/g)||[]).length,2);
  assert.doesNotMatch(app,/demo-snapshot\.json|WebSocket|EventSource/);
  assert.match(app,/not an 18-file run_demo\.sh rerun/);
});
