import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';

const app=await readFile('public/app.js','utf8');
const snapshotBytes=await readFile('public/data/lidar_case1_frozen_v0.1.0/ui_snapshot.json');
const manifestBytes=await readFile('public/data/lidar_case1_frozen_v0.1.0/manifest.json');

test('English and Chinese EP views define the evidence windows without promoting a candidate to T0',()=>{
  for(const label of ['Pre-event Window','Near-event Window','Post-event Window','Post-event Guard Window','Candidate Event Anchor'])assert.ok(app.includes(label),`missing English evidence label: ${label}`);
  for(const label of ['事件前窗口','临近事件窗口','事件后窗口','事件后保护窗口','候选事件锚点'])assert.ok(app.includes(label),`missing Chinese evidence label: ${label}`);
  assert.ok(app.includes("notProvided:'Not provided by snapshot'"));
  assert.ok(app.includes("notProvided:'快照未提供'"));
});

test('manual, Atlas-detected, and undetermined anchor sources have bilingual governance copy',()=>{
  for(const text of ['Manually specified','人工指定','Atlas auto-detected','Atlas 自动检测','Submitted by','提交人','Submitted at','提交时间','Trigger signal','触发信号','Trigger rule / version','触发规则／规则版本','Pending human confirmation','待人工确认','Confirmed','已确认','Candidate EP / Not frozen','候选 EP／尚未冻结'])assert.ok(app.includes(text),`missing anchor copy: ${text}`);
  assert.match(app,/function anchorKind\(artifact\)/);
  assert.match(app,/artifact\.anchor_source\?\?/);
  assert.match(app,/artifact\.trigger_signal/);
  assert.match(app,/artifact\.trigger_rule/);
  assert.match(app,/artifact\.confirmation_status/);
});

test('candidate copy forbids formal T0 and frozen-window claims when source metadata is absent',()=>{
  for(const text of ['This time is only a candidate event anchor; it is not a formal T0, and the five-part window is not frozen.','该时间仅为候选事件锚点，不是正式 T0，五段窗口尚未冻结。'])assert.ok(app.includes(text));
  assert.match(app,/kind==='candidate'/);
  assert.match(app,/isCandidate\?copy\.candidateAnchor:copy\.anchor/);
});

test('event anchor, anomaly duration, and REF creation are displayed as distinct concepts',()=>{
  for(const text of ['Event Anchor T0','事件锚点 T0','Anomaly duration','异常持续时段','REF created at','REF 创建时间'])assert.ok(app.includes(text));
  assert.match(app,/ref\.created_at\?\?ref\.ref_created_at/);
});

test('the window display retains the original time_window disclosure',()=>{
  assert.match(app,/evidenceTimeline\(val,kind\)/);
  assert.match(app,/JSON\.stringify\(timeWindow,null,2\)/);
  assert.match(app,/time-window-original/);
});

test('frozen JSON SHA-256 values remain unchanged',()=>{
  assert.equal(createHash('sha256').update(snapshotBytes).digest('hex'),'fe2c4cdd21262a6b365453683fc60c9a04cd6dc41c9eaf20e81c782468aeec24');
  assert.equal(createHash('sha256').update(manifestBytes).digest('hex'),'1df2f8928aadf7cacd37db98cf10a97efe1ff8012a0bea189886dee710ce8ffd');
});
