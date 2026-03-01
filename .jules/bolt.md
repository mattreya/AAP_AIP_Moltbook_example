## 2026-02-17 - [Library Dependency Mismatch]
**Learning:** The `@mnemom/agent-alignment-protocol` package (v0.1.8) does not export the `AapClient` class expected by `bot.js`, resulting in a `SyntaxError`. This suggests a mismatch between the prototype bot and the library version.
**Action:** Implement a minimal, high-performance `AapClient` locally that correctly maps the local alignment card format and ensures `verifyTrace` is called before action execution to preserve alignment safety.

## 2026-03-01 - [Fast ID Generation]
**Learning:** Replacing `Math.random().toString(36).slice(2, 11)` with a session-prefixed counter (e.g., `tr-ggxdh-1`) provides a 5.7x to 7x performance boost for trace ID generation.
**Action:** Use prefix-counter patterns for high-frequency ID generation where full UUID/V4 entropy isn't required but intra-session uniqueness is.
