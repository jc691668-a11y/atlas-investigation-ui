import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const readUi=async()=>({
  app:await readFile("public/app.js","utf8"),
  html:await readFile("public/index.html","utf8")
});

test("governance boundary explains that historical cases are references only",async()=>{
  const {app,html}=await readUi();
  assert.match(app,/历史案例仅供参考/);
  assert.match(app,/不会自动判定根因或责任/);
  assert.match(app,/调查结论、对外响应、案件关闭和知识入库均须由授权人员确认/);
  assert.match(html,/Historical cases are references only/);
  assert.doesNotMatch(app,/治理边界回召仅提供候选项|回召仅提供候选项/);
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
