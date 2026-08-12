import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';

const app=await readFile('public/app.js','utf8');
const snapshotBytes=await readFile('public/data/lidar_case1_frozen_v0.1.0/ui_snapshot.json');
const manifest=JSON.parse(await readFile('public/data/lidar_case1_frozen_v0.1.0/manifest.json'));

test('Chinese display copy covers the frozen V3 localization baseline',()=>{
  for(const text of ['冻结工件','快照清单','脱敏说明','已冻结','人工治理','调查生命周期','工件 ID','工件类型','来源 REF ID','来源观察记录 ID','时间窗口','已观察信号','冻结快照','服务影响','本地','机器人在服务过程中意外停止，多次重启后仍未恢复运行','不连接 Jetson/NUC · 不运行 CLI · 不调用后端 · 全程人工治理','译文仅供展示，原始快照未修改','查看原始字段'])assert.ok(app.includes(text),`missing Chinese UI copy: ${text}`);
});

test('English route copy remains available verbatim',()=>{
  for(const text of ['FROZEN ARTIFACT','INVESTIGATION LIFECYCLE','Frozen · Human governed','Back to official demo page','No Jetson/NUC · no CLI · no backend · human-governed investigation'])assert.ok(app.includes(text),`English copy changed: ${text}`);
});

test('localization leaves the frozen snapshot and declared SHA-256 unchanged',()=>{
  assert.equal(createHash('sha256').update(snapshotBytes).digest('hex'),manifest.ui_snapshot.sha256);
  assert.equal(manifest.ui_snapshot.sha256,'fe2c4cdd21262a6b365453683fc60c9a04cd6dc41c9eaf20e81c782468aeec24');
});
