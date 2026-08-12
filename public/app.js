const DATA_ROOT='/data/lidar_case1_frozen_v0.1.0';
const [snapshot,manifest]=await Promise.all([
  fetch(`${DATA_ROOT}/ui_snapshot.json`).then(readJson),
  fetch(`${DATA_ROOT}/manifest.json`).then(readJson)
]);

function readJson(response){if(!response.ok)throw new Error(`Frozen data unavailable (${response.status})`);return response.json()}
const $=selector=>document.querySelector(selector);
const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const locale=location.pathname.startsWith('/zh')?'zh':'en';
const copy={
  en:{declaration:'Atlas v0.1.0 frozen baseline · sanitized static demo · not live data',title:'Case 1 LiDAR artifacts',subtitle:'14 committed and verified frozen artifacts — not an 18-file run_demo.sh rerun',artifacts:'Frozen artifacts',source:'Source & integrity',sanitization:'Sanitization',sourceLabel:'Source directory',commit:'Source commit',hash:'Snapshot SHA-256',count:'Artifact count',note:'Sanitization note',boundary:'Read-only static presentation. No Jetson/NUC connection, CLI, backend, live execution, or device status.',back:'Back to official demo page',select:'Select an artifact to inspect its unmodified snapshot fields.'},
  zh:{declaration:'Atlas v0.1.0 冻结基线 · 已脱敏静态演示 · 非实时数据',title:'Case 1 LiDAR 产物',subtitle:'14 个已提交并验证的冻结产物——并非 run_demo.sh 的 18 文件重新运行结果',artifacts:'冻结产物',source:'来源与完整性',sanitization:'脱敏说明',sourceLabel:'来源目录',commit:'来源提交',hash:'快照 SHA-256',count:'产物数量',note:'脱敏说明',boundary:'只读静态展示。不连接 Jetson/NUC，不运行 CLI，不调用后端，不执行实时任务，也不显示设备状态。',back:'返回官网演示页',select:'选择产物以查看快照中的原始字段。'}
}[locale];
document.documentElement.lang=locale;
document.title=`Atlas 天枢 · ${copy.title}`;
$('#declaration').textContent=copy.declaration;
$('#page-title').textContent=copy.title;
$('#page-subtitle').textContent=copy.subtitle;
$('#artifact-heading').textContent=copy.artifacts;
$('#source-heading').textContent=copy.source;
$('#sanitization-heading').textContent=copy.sanitization;
$('#scope-copy').textContent=copy.boundary;
$('#back-link').textContent=copy.back;
document.querySelectorAll('.language-switcher a').forEach(link=>link.classList.toggle('active',link.dataset.locale===locale));

const metadata=[
  [copy.sourceLabel,manifest.source_directory],
  [copy.commit,manifest.source_commit],
  [copy.hash,manifest.ui_snapshot.sha256],
  [copy.count,manifest.artifact_count]
];
$('#manifest-metadata').innerHTML=metadata.map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('');
$('#sanitization-copy').innerHTML=`<p>${esc(manifest.sanitization.immutable_identifier_note)}</p><div class="tokens">${manifest.sanitization.fields.map(field=>`<span>${esc(field)}</span>`).join('')}</div>`;

let selected=0;
function artifactId(entry){return entry.artifact.artifact_id||entry.artifact.ref_id||entry.artifact.ir_id||entry.artifact.ll_id}
function render(){
  $('#artifact-list').innerHTML=snapshot.artifacts.map((entry,index)=>`<button class="artifact-item ${index===selected?'active':''}" data-index="${index}"><b>${String(index+1).padStart(2,'0')} · ${esc(artifactId(entry))}</b><span>${esc(entry.artifact.artifact_type||entry.artifact.ref_class||'governed_artifact')}</span><small>${esc(entry.source_file)}</small></button>`).join('');
  const entry=snapshot.artifacts[selected];
  $('#artifact-detail').innerHTML=`<div class="card-head"><div><p class="eyebrow">${esc(entry.artifact.artifact_type||entry.artifact.ref_class||'FROZEN ARTIFACT')}</p><h2>${esc(artifactId(entry))}</h2></div><span>SHA-256 VERIFIED SOURCE</span></div><p class="source-path">${esc(entry.source_file)}</p><pre>${esc(JSON.stringify(entry.artifact,null,2))}</pre>`;
  document.querySelectorAll('[data-index]').forEach(button=>button.onclick=()=>{selected=Number(button.dataset.index);render()});
}
$('#artifact-help').textContent=copy.select;
render();
