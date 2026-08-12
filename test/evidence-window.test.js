import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';

const app=await readFile('public/app.js','utf8');
const snapshotBytes=await readFile('public/data/lidar_case1_frozen_v0.1.0/ui_snapshot.json');

test('English and Chinese EP views define all five evidence windows',()=>{
  for(const label of ['Pre-event Window','Near-event Window','Canonical Event T0','Post-event Window','Post-event Guard Window']){
    assert.ok(app.includes(label),`missing English evidence window: ${label}`);
  }
  for(const label of ['事件前窗口','临近事件窗口','规范事件 T0','事件后窗口','事件后保护窗口']){
    assert.ok(app.includes(label),`missing Chinese evidence window: ${label}`);
  }
  assert.ok(app.includes("notProvided:'Not provided by snapshot'"));
  assert.ok(app.includes("notProvided:'快照未提供'"));
});

test('the five-window display retains the original time_window disclosure',()=>{
  assert.match(app,/evidenceTimeline\(val,entry\.artifact\.window_summary\)/);
  assert.match(app,/JSON\.stringify\(timeWindow,null,2\)/);
  assert.match(app,/time-window-original/);
});

test('frozen ui_snapshot.json SHA-256 remains unchanged',()=>{
  assert.equal(createHash('sha256').update(snapshotBytes).digest('hex'),'fe2c4cdd21262a6b365453683fc60c9a04cd6dc41c9eaf20e81c782468aeec24');
});
