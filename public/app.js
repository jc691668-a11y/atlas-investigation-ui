const demoArtifact = Object.freeze({
  demo_notice: "UI DEMO DATA — NOT A REAL BASELINE RESULT",
  observed_topics: ["/demo/camera", "/demo/imu", "/demo/odometry"],
  topic_eligibility: {
    "/demo/camera": "illustrative eligible",
    "/demo/imu": "illustrative eligible",
    "/demo/odometry": "illustrative review"
  },
  timing_relationships: [
    { source: "/demo/camera", target: "/demo/imu", relationship: "illustrative alignment", offset_ms: 12 },
    { source: "/demo/imu", target: "/demo/odometry", relationship: "illustrative sequence", offset_ms: 4 }
  ],
  governance_evidence_windows: [{ label: "demo-window-01", start: "T+00:00", end: "T+00:30", status: "illustrative" }],
  classification_state: "DEMO — NOT EVALUATED"
});

const parsedDemo = {
  observedTopics: demoArtifact.observed_topics,
  topicClassification: demoArtifact.topic_eligibility,
  timingRelationships: demoArtifact.timing_relationships,
  evidenceWindows: demoArtifact.governance_evidence_windows,
  classificationState: demoArtifact.classification_state,
  raw: demoArtifact
};

const fields = [
  ["Observed topics", "observedTopics"],
  ["Topic eligibility / classification", "topicClassification"],
  ["Timing relationships", "timingRelationships"],
  ["Governance / evidence windows", "evidenceWindows"],
  ["Classification state", "classificationState"]
];

const answers = {
  summarize: "The demo presents 3 illustrative topics, 3 illustrative classifications, and 2 illustrative timing relationships. This is a UI walkthrough, not a completed validation.",
  evidence: "The displayed demo window and topic labels exist only to demonstrate evidence presentation. They are not produced by Atlas and must not be used for an investigation decision.",
  timing: "Two illustrative timing rows demonstrate the intended layout. No real timestamps were analyzed and no causal interpretation is available.",
  missing: "A real Atlas artifact, CLI execution log, exit code, verified evidence windows, and baseline classification are all intentionally absent from this preview.",
  next: "Connect the reviewed Local Atlas Runner in an approved environment, execute the documented public SDK baseline, then replace demo values with the resulting sanitized artifact."
};

const escapeHtml = (value) => String(value).replace(/[&<>]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[character]);
const fieldsElement = document.querySelector("#fields");
fieldsElement.innerHTML = fields.map(([title, key]) => `<section class="field"><h3>${title}<span>DEMO</span></h3><pre>${escapeHtml(JSON.stringify(parsedDemo[key], null, 2))}</pre></section>`).join("");
document.querySelector("#raw pre").textContent = JSON.stringify(parsedDemo.raw, null, 2);

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = answers[button.dataset.action];
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = `DRAFT / AI-assisted — UI DEMO DATA ONLY. ${answer} This response does not confirm root cause.`;
    document.querySelector("#chat").append(bubble);
    bubble.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});
