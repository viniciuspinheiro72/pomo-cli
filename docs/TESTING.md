# Testing Strategy

## Testing Philosophy
Test behavior, not implementation. Unit test domain logic in isolation. Integration tests validate the full command flow against real file I/O.

## Scope
### In Scope
- Session start/stop/status logic
- Break sequence rules (short break after each, long break after 4)
- Config validation
- State file read/write
- CLI command output format

### Out of Scope
- Desktop notification delivery (OS-level, untestable in CI)
- Timer accuracy under OS load

## Test Types & Tools
| Type        | Tool | Notes |
|-------------|------|-------|
| Unit        | Vitest | Domain logic, pure functions |
| Integration | Vitest | Commands against temp state dir |
| E2E         | — | Not needed — CLI is the boundary |

## Entry Criteria
- All dependencies installed
- TypeScript compiles without errors

## Exit Criteria
- All tests pass
- Coverage floors met (see CONSTITUTION.md)
- No `console.error` calls in test output

## Test Environment
| Environment | Purpose | DB | External APIs |
|-------------|---------|----|----|
| local | Development | Temp dir (`/tmp/pomo-test-*`) | Mocked |
| CI | Validation | Temp dir | Mocked |

## Unit Test Patterns
- Test domain functions directly — no Commander.js involvement
- Mock `Date.now()` to control timer behavior
- Never test node-notifier internals — mock the notifier abstraction

## Integration Test Scope
- Each CLI command invoked via the command handler function (not shell exec)
- State written to isolated temp directory per test, cleaned up after

## E2E Scenarios (Critical Paths)
- `pomo start` → session created in state file
- `pomo start` while active → warning shown, session unchanged
- Session expires → break starts automatically, notification triggered

## Risks & Mitigations
| Risk | Mitigation |
|------|-----------|
| Flaky timer tests | Always mock `Date.now()` — never rely on real time |
| State file pollution between tests | Each test uses isolated `POMO_CONFIG_DIR` temp dir |

## CI/CD Integration
Tests run on every push. Blocking — PR cannot merge with failing tests.

## How to Run Tests Locally
```bash
# Run all tests:
pnpm test

# Run unit tests only:
pnpm test src/domain

# Run with coverage report:
pnpm test --coverage
```
