import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {FIELD_ZH,VALUE_ZH,localizeArtifact} from '../public/localization.js';

const root='public/data/lidar_case1_frozen_v0.1.0';
const app=await readFile('public/app.js','utf8');
const localization=await readFile('public/localization.js','utf8');
const snapshotBytes=await readFile(`${root}/ui_snapshot.json`);
const manifestBytes=await readFile(`${root}/manifest.json`);
const snapshot=JSON.parse(snapshotBytes);
const manifest=JSON.parse(manifestBytes);
const sourceStrings=[];
function strings(value){if(Array.isArray(value))value.forEach(strings);else if(value&&typeof value==='object')Object.values(value).forEach(strings);else if(typeof value==='string')sourceStrings.push(value)}
snapshot.artifacts.forEach(({artifact})=>strings(artifact));
const isBusinessSentence=value=>/[A-Za-z]/.test(value)&&/[.!]$/.test(value);

 test('all 14 artifacts localize every nested label, enum, array, summary, and boundary',()=>{
  assert.equal(snapshot.artifacts.length,14);
  for(const {artifact,source_file} of snapshot.artifacts)assert.doesNotThrow(()=>localizeArtifact(artifact),source_file);
  assert.equal(Object.keys(FIELD_ZH).length,96);
  assert.equal(Object.keys(VALUE_ZH).filter(isBusinessSentence).length,106);
  assert.equal(Object.keys(VALUE_ZH).length-106,51);
 });

test('Chinese visible artifact output contains no silently-fallback English business sentence',()=>{
 for(const {artifact} of snapshot.artifacts){
  const visible=JSON.stringify(localizeArtifact(artifact));
  for(const original of sourceStrings.filter(isBusinessSentence))assert.ok(!visible.includes(original),`English leaked: ${original}`);
 }
});

test('required Chinese UI, lifecycle helpers, statuses, and original-field disclosure exist',()=>{
 const text=app+localization;
 for(const value of ['工件 ID','工件类型','来源传感器 REF ID','来源 EGP ID','上级 REF ID','发起方','REF 类别','时间窗口','已观察信号','传感器侧证据摘要','证据模式','受理摘要','受理范围','结论边界','状态','负责人','调查发现','经验记录','处置决定','已授权','来源提交','快照 SHA-256','脱敏说明','1 个已冻结案例','人工治理','仅元数据','层级候选','证据包','调查工单','历史调查召回','传感器协作包','调查结果／经验记录','辅助知识库','未推断根因（root_cause_inferred=false）','查看原始字段'])assert.ok(text.includes(value),`missing Chinese display copy: ${value}`);
 assert.match(app,/<details class="original-fields">/);
});

test('English route retains snapshot values verbatim and bypasses Chinese localization',()=>{
 assert.match(app,/locale==='zh'\?localizeArtifact\(val\):val/);
 for(const text of ['FROZEN ARTIFACT','INVESTIGATION LIFECYCLE','Frozen · Human governed','Back to official demo page','No Jetson/NUC · no CLI · no backend · human-governed investigation'])assert.ok(app.includes(text),`English copy changed: ${text}`);
 for(const value of sourceStrings)assert.ok(snapshotBytes.includes(Buffer.from(value)),`English snapshot value changed: ${value}`);
});

test('both frozen JSON files retain their exact baseline SHA-256',()=>{
 assert.equal(createHash('sha256').update(snapshotBytes).digest('hex'),'fe2c4cdd21262a6b365453683fc60c9a04cd6dc41c9eaf20e81c782468aeec24');
 assert.equal(createHash('sha256').update(manifestBytes).digest('hex'),'1df2f8928aadf7cacd37db98cf10a97efe1ff8012a0bea189886dee710ce8ffd');
 assert.equal(manifest.ui_snapshot.sha256,'fe2c4cdd21262a6b365453683fc60c9a04cd6dc41c9eaf20e81c782468aeec24');
});
