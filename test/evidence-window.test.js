import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {rangesOverlap} from '../public/event-time.js';

const app=await readFile('public/app.js','utf8');
const snapshotBytes=await readFile('public/data/lidar_case1_frozen_v0.1.0/ui_snapshot.json');
const manifestBytes=await readFile('public/data/lidar_case1_frozen_v0.1.0/manifest.json');

test('EP timing distinguishes reported, retrieval, observation, T0, and REF creation concepts',()=>{
  for(const label of ['Customer-reported time','Atlas retrieval range','Atlas observation','Event Anchor T0','REF created at','客户报告时间','Atlas 检索范围','Atlas 观察','事件锚点 T0','REF 创建时间'])assert.ok(app.includes(label),`missing timing label: ${label}`);
  assert.match(app,/ref\.customer_report_time_range\?\?ref\.reported_time_range\?\?ref\.time_range/);
  assert.match(app,/observation\.observation_window\?\?artifact\.observation_window/);
  assert.match(app,/artifact\.anchor_t0\?\?artifact\.canonical_event_t0/);
  assert.match(app,/ref\.created_at\?\?ref\.ref_created_at/);
});

test('missing optional ranges are hidden rather than rendered as unavailable placeholders',()=>{
  assert.match(app,/customer&&`<div class="time-track customer"/);
  assert.match(app,/retrieval&&`<div class="retrieval-row"/);
  assert.doesNotMatch(app,/快照未提供|Not provided by snapshot/);
});

test('non-overlapping report and observation require human confirmation',()=>{
  const report={start:'2026-08-12T13:00:00Z',end:'2026-08-12T15:00:00Z'};
  const observed={start:'2026-08-12T12:00:00Z',end:'2026-08-12T12:30:00Z'};
  assert.equal(rangesOverlap(report,observed),false);
  assert.ok(app.includes('Atlas在客户报告时间之外发现相关异常，需人工确认是否属于同一事件。'));
  assert.ok(app.includes('Atlas found a related anomaly outside the customer-reported time. Human confirmation is required to determine whether it belongs to the same incident.'));
});

test('overlap is not automatically claimed as the same incident',()=>{
  assert.equal(rangesOverlap({start:'2026-08-12T13:00:00Z',end:'2026-08-12T15:00:00Z'},{start:'2026-08-12T14:00:00Z',end:'2026-08-12T14:30:00Z'}),true);
  assert.ok(app.includes('human confirmation is still required before treating them as the same incident'));
  assert.ok(app.includes('仍需人工确认是否属于同一事件'));
});

test('frozen EP retains five windows and raw time-window disclosure without candidate language',()=>{
  for(const label of ['Pre-event Window','Near-event Window','Post-event Window','Post-event Guard Window','事件前窗口','临近事件窗口','事件后窗口','事件后保护窗口','Frozen EP','冻结 EP'])assert.ok(app.includes(label));
  assert.doesNotMatch(app,/Candidate EP|候选 EP|Candidate Event Anchor|候选事件锚点|Not frozen|尚未冻结/);
  assert.match(app,/JSON\.stringify\(timeWindow,null,2\)/);
  assert.match(app,/time-window-original/);
});

test('frozen JSON SHA-256 values remain unchanged',()=>{
  assert.equal(createHash('sha256').update(snapshotBytes).digest('hex'),'fe2c4cdd21262a6b365453683fc60c9a04cd6dc41c9eaf20e81c782468aeec24');
  assert.equal(createHash('sha256').update(manifestBytes).digest('hex'),'1df2f8928aadf7cacd37db98cf10a97efe1ff8012a0bea189886dee710ce8ffd');
});
