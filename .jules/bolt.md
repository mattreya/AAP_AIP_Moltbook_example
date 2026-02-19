## 2026-02-17 - [Library Dependency Mismatch]
**Learning:** The `@mnemom/agent-alignment-protocol` package (v0.1.8) does not export the `AapClient` class expected by `bot.js`, resulting in a `SyntaxError`. This suggests a mismatch between the prototype bot and the library version.
**Action:** Implement a minimal, high-performance `AapClient` locally that correctly maps the local alignment card format and ensures `verifyTrace` is called before action execution to preserve alignment safety.

## 2026-02-19 - [Hot Path Trace Optimization]
**Learning:** Object allocation and slow ID generation in the `traceAction` hot path significantly increased overhead. Pre-calculating constructor fields and using frozen constants reduced per-call micro-overhead by ~9.5% in this environment.
**Action:** Prioritize frozen constants for headers and empty arrays, and use counter-based trace IDs for high-frequency tracing in AAP-aligned agents.
