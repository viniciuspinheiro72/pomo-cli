@AGENTS.md
@docs/PRODUCT_BRIEF.md
@docs/ACTIVE_CONTEXT.md
@docs/ARCHITECTURE.md
@docs/STRUCTURE.md
@docs/GLOSSARY.md

<!-- The @-imports above enforce the "always" injection tier.
     Auto and Manual docs are read on demand — do not import them here. -->

## Claude-Specific Configuration

### Memory
<!-- Session protocol is defined in AGENTS.md under "Session Protocol" — no need to duplicate here.
     Add only Claude-specific overrides or additions below. -->

### Hooks
<!-- Claude Code hooks for this project. Configure in .claude/settings.json -->
<!-- Examples (uncomment and adapt):
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [{ "type": "command", "command": "echo 'Writing file — check CONSTITUTION.md first'" }]
      }
    ],
    "Stop": [
      {
        "matcher": ".*",
        "hooks": [{ "type": "command", "command": "echo 'Session ending — update ACTIVE_CONTEXT.md'" }]
      }
    ]
  }
}
-->

### Slash Commands / Skills
<!-- /superpowers — brainstorm → plan → execute workflow for feature work -->

### Personas / Modes
<!-- Default: senior TypeScript CLI engineer (see Role in AGENTS.md) -->

## Document Index

| Document       | File                       | Injection  | Purpose                                        |
|----------------|----------------------------|------------|------------------------------------------------|
| Constitution   | `./CONSTITUTION.md`        | always     | Immutable hard constraints and invariants      |
| AI Context     | `./AGENTS.md`              | always     | Coding conventions, patterns, boundaries       |
| Product Brief  | `./docs/PRODUCT_BRIEF.md`  | always     | What it is, who it's for, why it matters       |
| Active Context | `./docs/ACTIVE_CONTEXT.md` | always     | Current session state and in-progress work     |
| Architecture   | `./docs/ARCHITECTURE.md`   | always     | Folder map, layers, dependency rules           |
| Structure      | `./docs/STRUCTURE.md`      | always     | File naming, import patterns, conventions      |
| Glossary       | `./docs/GLOSSARY.md`       | always     | Domain language and term definitions           |
| PRD            | `./docs/PRD.md`            | auto       | Full product requirements and user stories     |
| Tech Design    | `./docs/TECH_DESIGN.md`    | auto       | Stack decisions and technical design           |
| Testing        | `./docs/TESTING.md`        | auto       | Test philosophy and coverage rules             |
| Research       | `./docs/RESEARCH.md`       | auto       | Market context and technical feasibility       |
| Progress       | `./docs/PROGRESS.md`       | manual     | Done / In Progress / Blocked / Next            |
| Decision Log   | `./docs/DECISION_LOG.md`   | manual     | Lightweight chronological decisions            |
| Pitfalls       | `./docs/PITFALLS.md`       | manual     | Known gotchas and lessons learned              |
| ADRs           | `./docs/adr/`              | manual     | Architecture Decision Records                  |
