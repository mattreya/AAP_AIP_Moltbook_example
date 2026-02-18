## 2026-02-17 - [Library Dependency Mismatch]
**Learning:** The `@mnemom/agent-alignment-protocol` package (v0.1.8) does not export the `AapClient` class expected by `bot.js`, resulting in a `SyntaxError`. This suggests a mismatch between the prototype bot and the library version.
**Action:** Implement a minimal, high-performance `AapClient` locally that correctly maps the local alignment card format and ensures `verifyTrace` is called before action execution to preserve alignment safety.

## 2026-02-18 - [Object Stripping Risk in Config Mapping]
**Learning:** When optimizing object creation for internal card mappings, stripping "unknown" properties by avoiding the spread operator (`...card`) can break downstream verification logic (like `verifyTrace`) that depends on metadata or extended schema fields.
**Action:** Use the spread operator to preserve all original configuration properties while overriding only the specific fields required for protocol compliance or optimization.
