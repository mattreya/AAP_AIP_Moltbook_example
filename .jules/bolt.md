## 2026-02-17 - [Library Dependency Mismatch]
**Learning:** The `@mnemom/agent-alignment-protocol` package (v0.1.8) does not export the `AapClient` class expected by `bot.js`, resulting in a `SyntaxError`. This suggests a mismatch between the prototype bot and the library version.
**Action:** Implement a minimal, high-performance `AapClient` locally that correctly maps the local alignment card format and ensures `verifyTrace` is called before action execution to preserve alignment safety.

## 2026-02-20 - [AapClient traceAction Overhead]
**Learning:** The `traceAction` method is a high-frequency path. Initial implementation used `Math.random().toString(36)` and created multiple nested objects and arrays on every call, leading to unnecessary GC pressure and CPU cycles.
**Action:** Optimize by pre-calculating constant fields in the constructor, using a simple counter for trace IDs, and reusing frozen constants for common empty values and headers. This reduced overhead by approximately 10%.
