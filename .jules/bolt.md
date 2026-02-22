## 2026-02-17 - [Library Dependency Mismatch]
**Learning:** The `@mnemom/agent-alignment-protocol` package (v0.1.8) does not export the `AapClient` class expected by `bot.js`, resulting in a `SyntaxError`. This suggests a mismatch between the prototype bot and the library version.
**Action:** Implement a minimal, high-performance `AapClient` locally that correctly maps the local alignment card format and ensures `verifyTrace` is called before action execution to preserve alignment safety.

## 2026-02-22 - [Shared State Mutation Risk in Micro-optimizations]
**Learning:** Reusing an empty array constant (`[]`) across multiple properties and instances to save allocations is a dangerous anti-pattern. If any part of the app mutates the array, it corrupts all shared references. Modern V8 handles literal `[]` allocations efficiently.
**Action:** Avoid sharing mutable-by-default constants like arrays or objects unless they are frozen or strictly internal. Favor literal `[]` for clarity and safety.
