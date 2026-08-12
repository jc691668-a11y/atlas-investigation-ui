# Atlas Static Demo Snapshot

A read-only customer demonstration of the Atlas investigation lifecycle. Vercel publishes only HTML, CSS, JavaScript, images, and `demo-snapshot.json`; it has no API, server, Local Runner, `ATLAS_CLI`, Jetson/NUC dependency, device status, or live execution.

## Routes

- `/demo/tier1`
- `/demo/investigation`
- `/demo/sensor-fae`
- `/demo/cto`

All four role projections fetch the same immutable `public/demo-snapshot.json` and therefore share one case ID, REF, EP, and EGP.

## Source-to-presentation mapping

The snapshot follows the investigation chain defined by `demos/lidar_canary/run_demo.sh` and uses baseline surface terminology reviewed against `bin/atlas`, `samples/rosbag2_runtime_observation_sample`, `docs/ATLAS_SURFACE_INTEGRATION_SPEC.md`, `scripts/run_code_ready_gate.sh`, and `BASELINE_FREEZE_REPORT.md` in the authoritative `sensordeck/atlas-dsil-sdk` repository. It is a sanitized presentation projection, not a new executable artifact contract: Runtime Dataset / Agent observation → EP → REF → Historical RGA → Investigation Context → Investigation Tier Candidate → EGP → IR/LL + OEM Response → OEM Closure → Assist Candidate/Vault.

All identities, timestamps, topic names, observations, and identifiers are explicitly fictionalized demo values. No customer data, private-repository content, credentials, commercial information, or internal algorithms are included. Similarity is non-causal; responsibility, Closure, IR/LL authorization, and Vault writes remain human-controlled.

## Checks

```bash
npm test
npm run build
```
