# Atlas Static Demo Snapshot

A read-only customer demonstration of the Atlas investigation lifecycle. Vercel publishes only HTML, CSS, JavaScript, images, and the frozen files under `public/data/lidar_case1_frozen_v0.1.0/`; it has no API, server, Local Runner, `ATLAS_CLI`, Jetson/NUC dependency, device status, or live execution.

## Routes

- `/en/`
- `/zh/`

Both localized views fetch the same immutable `ui_snapshot.json` and `manifest.json`. The snapshot is the only source for displayed artifact fields; the manifest supplies source provenance, the frozen version, SHA-256 values, and sanitization details.

## Source-to-presentation mapping

The display contains 14 committed and verified frozen Case 1 LiDAR artifacts. It is not presented as a fresh execution of the current 18-file `run_demo.sh` output.

Technical measurements and artifact values are rendered directly from the committed snapshot without invention or modification. See the accompanying manifest for the exact sanitization statement and source hashes.

## Checks

```bash
npm test
npm run build
```
