@Jules

Repository TODO list: improvements to `bot.js` and supporting files

- [ ] Add fetch fallback and request timeout (AbortController)
- [ ] Implement retries with exponential backoff for network calls
- [ ] Replace `process.exit` with thrown errors and central error handler
- [ ] Validate `config/alignment-card.json` schema at startup (ajv or simple checks)
- [ ] Externalize configuration into `config.js` and support env + .env
- [ ] Create `runTracedAction` helper to DRY `traceAction` usage
- [ ] Improve logging: add structured logger wrapper (pino/winston)
- [ ] Ensure consistent error propagation and structured result objects
- [ ] Add unit tests (mock fetch) and an integration test with a mock Moltbook server
- [ ] Update `package.json` and `README.md` for new dependencies and run instructions

Notes:
- These tasks were captured by the assistant's tracked TODO list and prioritized for incremental implementation.
- Reply with which item to implement first and I'll open a PR-style patch implementing it.
