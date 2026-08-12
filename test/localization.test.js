import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {demoCases,demoCasesZh,dashboard,dashboardZh,demoDataFor} from "../public/demo-data.js";

const lifecycle=["dataset","ep","ref","rga","context","tier","egp","sensor_ir","sensor_ll","oem_response","closure","assist"];
const strings=value=>typeof value==="string"?[value]:Array.isArray(value)?value.flatMap(strings):value&&typeof value==="object"?Object.values(value).flatMap(strings):[];
const allowed=/\b(?:SensorDeck|Atlas|Agent|OEM|FAE|REF|EP|RGA|EGP|IR|LL|ID|ROS|Linux Runtime|LiDAR|IMU|AMR|T0|SLA|WINPOL-DEFAULT-001|root_cause_inferred|dataset_lock|true|false)\b/g;
const artifactId=/\b(?:REF|RDS|EP|CTX|RGA|TIER|EGP|IR|LL|OEMR|CLOSE|AC)-[A-Z]+-\d{4}-\d{3}\b/g;
const englishSentence=/\b[A-Za-z][a-z]{2,}\s+[a-z][a-z-]{2,}\b/;

test("/zh/ covers every lifecycle stage in all three cases without English sentences",()=>{
  assert.equal(demoCasesZh.length,3);
  for(const record of demoCasesZh){
    for(const stage of lifecycle)assert.ok(record[stage],`${record.id} is missing ${stage}`);
    for(const text of strings(record)){
      const residue=text.replace(artifactId,"").replace(allowed,"");
      assert.doesNotMatch(residue,englishSentence,`${record.id}: ${text}`);
    }
  }
  for(const text of strings(dashboardZh))assert.doesNotMatch(text.replace(allowed,""),englishSentence,text);
});

test("/zh/ navigation, pages, Assist, dashboard, boundaries, and official terms are translated",async()=>{
  const app=await readFile("public/app.js","utf8");
  const html=await readFile("public/index.html","utf8");
  for(const chinese of ["运行时概览","数据集","证据包","调查","历史 RGA","传感器协作","辅助知识库","CTO 仪表板","已脱敏演示数据","运行时表面","运行时数据集","调查上下文","调查层级候选","传感器协作包","调查结果","经验教训","辅助候选","ATLAS 辅助","数据边界","调查全生命周期"])
    assert.match(app,new RegExp(chinese));
  for(const page of ["overview","datasets","ep","investigations","rga","egp","vault","cto"])
    assert.match(html,new RegExp(`data-page="${page}"`));
});

test("/en/ keeps the canonical complete English demo data",()=>{
  assert.strictEqual(demoDataFor("en").demoCases,demoCases);
  assert.strictEqual(demoDataFor("en").dashboard,dashboard);
  for(const title of ["LiDAR link interruption","Camera frame stall","IMU timing drift"])
    assert.ok(strings(demoCases).includes(title));
  for(const phrase of ["Historical similarity does not establish root cause.","Observation review in progress","No authorized lesson recorded","No disposition recorded"])
    assert.ok(strings(demoCases).includes(phrase));
});
