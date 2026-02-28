## 2026-02-17 - [Library Dependency Mismatch]
**Learning:** The `@mnemom/agent-alignment-protocol` package (v0.1.8) does not export the `AapClient` class expected by `bot.js`, resulting in a `SyntaxError`. This suggests a mismatch between the prototype bot and the library version.
**Action:** Implement a minimal, high-performance `AapClient` locally that correctly maps the local alignment card format and ensures `verifyTrace` is called before action execution to preserve alignment safety.

## 2026-02-28 - [Trace ID Generation and Object Allocation]
**Learning:** Replacing `Math.random().toString(36)` with a session-prefixed counter significantly reduces CPU overhead for ID generation (~7x faster). Pre-calculating and freezing configuration fields in the constructor further reduces property lookups and optional chaining overhead in hot paths.
**Action:** Use `Object.freeze([...array])` to safely cache configuration arrays without side effects on the input object.
