## 2026-02-17 - [Library Dependency Mismatch]
**Learning:** The `@mnemom/agent-alignment-protocol` package (v0.1.8) does not export the `AapClient` class expected by `bot.js`, resulting in a `SyntaxError`. This suggests a mismatch between the prototype bot and the library version.
**Action:** Implement a minimal, high-performance `AapClient` locally that correctly maps the local alignment card format and ensures `verifyTrace` is called before action execution to preserve alignment safety.

## 2026-02-21 - [Object.freeze Performance Overhead]
**Learning:** Extensive use of `Object.freeze` on hot paths (like trace generation) in Node.js (v20+) can lead to measurable performance degradation (~5-10% slower) rather than optimization. While it provides immutability safety, the overhead of the freeze operation and subsequent V8 access optimization constraints on frozen objects outweighs the benefits in high-frequency scenarios.
**Action:** Avoid `Object.freeze` on objects created in high-frequency loops. Use it only for static configuration or one-time initializations where safety is paramount and the performance hit is negligible.
