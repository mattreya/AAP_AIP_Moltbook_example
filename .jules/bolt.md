## 2026-02-17 - [Library Dependency Mismatch]
**Learning:** The `@mnemom/agent-alignment-protocol` package (v0.1.8) does not export the `AapClient` class expected by `bot.js`, resulting in a `SyntaxError`. This suggests a mismatch between the prototype bot and the library version.
**Action:** Implement a minimal, high-performance `AapClient` locally that correctly maps the local alignment card format and ensures `verifyTrace` is called before action execution to preserve alignment safety.

## 2026-02-24 - [Micro-optimization: ID Generation & Property Access]
**Learning:** In high-frequency hot paths like AAP tracing, `Math.random().toString(36)` and repeated property lookups with optional chaining on complex objects can become measurable bottlenecks.
**Action:** Use session-prefixed counters for unique IDs and pre-calculate/cache static values in constructors to minimize runtime overhead. In Node.js v22, this reduced ID generation time by ~70% (333ms to 93ms for 1M iterations).
