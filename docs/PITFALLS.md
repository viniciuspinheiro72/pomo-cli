# Pitfalls & Known Gotchas

<!-- Each entry: what the trap is, why it happens, how to avoid it. -->

## Timer drift with setInterval
- **What happens:** Timer drifts by several seconds over a 25-min session
- **Why it happens:** `setInterval` is not accurate under CPU load — each tick fires slightly late, error accumulates
- **How to avoid:** Store `startedAt` as an ISO timestamp on session start; compute remaining time as `duration - (Date.now() - startedAt)` on each `status` call
- **Discovered:** Design phase — known Node.js gotcha

## node-notifier silent failure on Linux without libnotify
- **What happens:** Notifications silently do nothing on minimal Linux installs
- **Why it happens:** `node-notifier` depends on `notify-send` which requires `libnotify-bin`
- **How to avoid:** Wrap notification call in try/catch; fall back to terminal bell (`\x07`) and a printed message
- **Discovered:** Expected from node-notifier docs — add to README prerequisites
