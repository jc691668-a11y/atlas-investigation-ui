import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const readUi=async()=>({
  app:await readFile("public/app.js","utf8"),
  html:await readFile("public/index.html","utf8")
});

test("queue shows the current investigation progress",async()=>{
  const {app,html}=await readUi();
  assert.match(app,/调查进度/);
  assert.match(app,/已完成 6 \/ 10 个阶段/);
  assert.match(app,/当前：层级候选/);
  assert.match(app,/下一步：生成传感器协作包 EGP/);
  assert.match(html,/INVESTIGATION PROGRESS/);
  assert.doesNotMatch(html,/GOVERNANCE BOUNDARY|Historical cases are references only/);
});

test("right rail is an investigation assistant with explicit read-only limits",async()=>{
  const {app,html}=await readUi();
  assert.match(app,/Atlas 调查助手/);
  assert.match(app,/不能推断根因、修改工件、批准结论或执行治理操作/);
  assert.match(html,/Atlas Investigation Assistant/);
  assert.match(html,/cannot infer root cause, modify artifacts, approve findings, or perform governance actions/);
  assert.doesNotMatch(app,/冻结工件助手/);
});

test("investigation assistant offers five review-oriented actions in both locales",async()=>{
  const {app}=await readUi();
  for(const label of ["汇总当前工件","解释这个字段","说明该阶段的作用","还缺少哪些证据？","哪些事项需要人工确认？"]){
    assert.ok(app.includes(label),`missing Chinese assistant action: ${label}`);
  }
  for(const label of ["Summarize current artifacts","Explain this field","Explain this stage","What evidence is still missing?","What requires human confirmation?"]){
    assert.ok(app.includes(label),`missing English assistant action: ${label}`);
  }
});
