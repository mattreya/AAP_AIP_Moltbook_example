## 2026-02-17 - [Library Dependency Mismatch]
**Learning:** The `@mnemom/agent-alignment-protocol` package (v0.1.8) does not export the `AapClient` class expected by `bot.js`, resulting in a `SyntaxError`. This suggests a mismatch between the prototype bot and the library version.
**Action:** Implement a minimal, high-performance `AapClient` locally that correctly maps the local alignment card format and ensures `verifyTrace` is called before action execution to preserve alignment safety.

## 2026-02-23 - [High-Throughput ID Generation]
**Learning:** In high-throughput scenarios, repeated calls to Math.random().toString(36) for ID generation introduce significant overhead (~325ms vs ~45ms for 1M iterations).
**Action:** Use a session-prefixed sequential counter for fast, collision-safe ID generation within a single process.
