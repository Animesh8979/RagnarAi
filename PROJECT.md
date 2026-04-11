# RagnarShortsAi

## Current State

RagnarShortsAi is a live Node.js "video-as-code" pipeline that generates, renders, reviews, and publishes daily vertical videos for YouTube Shorts and Instagram Reels.

As of 2026-04-04, the working production baseline is:

- Orchestration: `run-today.js`, `scheduler.js`, `pipeline-cli.js`, watchdog/recovery scripts
- Active render path: `v15-factory.js` as the runtime entry, backed by `v12-factory.js` as the core implementation engine
- Composition/rendering: Remotion + FFmpeg
- Script generation: Gemini, Ollama, and multi-provider fallbacks
- Story generation: Hindi serialized story engine
- Voice stack: Kokoro JS for English, Edge/Google fallbacks for Hindi
- Distribution: YouTube Shorts + Instagram Reels
- Quality/recovery: JSON reports, post-upload review hooks, performance ledger, recovery queue, circuit breakers

This repo is already in active production. Phase 3 must be integrated as a controlled migration, not a destructive rewrite.

## Source Of Truth For This Initialization

This root project file is synthesized from the repo's existing working state, primarily:

- `.gsd/STATE.md`
- `.gsd/STACK.md`
- `.gsd/ARCHITECTURE.md`
- `.gsd/TODO.md`
- `.planning/debug/2026-04-04-post-upgrade-pipeline-debug.md`
- `package.json`

## Phase 3 Initialization

Phase 3 is now initialized as:

**Phase 3: The 2025-2026 Autonomous Media Framework**

Goal: evolve the current autonomous shorts pipeline into a profile-driven, agentic media framework with better avatar consistency, stronger storytelling, more human voice output, better retention editing, and explicit platform-safety controls.

## Non-Destructive Integration Rules

These rules are mandatory for all Phase 3 work:

1. Do not break the current daily YouTube + Instagram batch.
2. Do not replace `run-today.js`, `scheduler.js`, or the active uploaders in one shot.
3. Treat `v15-factory.js` as the current production entrypoint and `v12-factory.js` as the implementation core to be decomposed behind stable interfaces.
4. Ship all new media-generation systems behind feature flags, shadow outputs, or sidecar adapters before swapping the live path.
5. Preserve current recovery primitives: state files, recovery queue, upload review, circuit breakers, and performance ledger.
6. No Phase 3 component may require unlicensed voices, non-owned actor likenesses, or commercially unsafe default model assets.

## What Phase 3 Changes

Phase 3 does not replace the entire system. It introduces a new target architecture around:

- Agentic verticals with profile-driven behavior
- A Voice Artist Agent
- A Visual Director Agent
- Stronger JSON-timeline retention editing
- Safer commercial/legal posture
- Feedback loops that learn from performance data

## Phase 3 Roadmap

### 3.1 Voice Artist Agent Foundation

Build a shadow-path voice stack that upgrades narration quality without touching the live batch until parity is proven.

Focus:

- Kokoro-82M prompt and paralinguistic control
- emotional markup contract (`[laugh]`, `[sigh]`, stress markers)
- headless voice-conversion bridge evaluation
- owned/licensed narrator strategy
- Hindi voice QA and multilingual validation

### 3.2 Visual Director Agent Foundation

Build a character-locked visual path for stories and presenter-led news segments.

Focus:

- Flux character consistency strategy
- LivePortrait/ComfyUI avatar animation sidecar
- portrait + driving-motion input contract
- upscale/restoration stage
- commercial-safe model replacement where needed

### 3.3 Verticals v3 Orchestration

Move toward profile-driven generation without destabilizing current slot orchestration.

Focus:

- Niche Profile contract
- News Agent
- Story Architect
- Editor Bot
- Manager Agent abstraction
- compatibility layer over current `run-today.js` flow

### 3.4 Programmatic Retention Editor

Define a reusable JSON timeline layer for pacing and conversion edits.

Focus:

- visual pattern interrupts
- word-level captions
- high-contrast power overlays
- progressive rhythm editing
- replay-loop ending design

### 3.5 Compliance And Distribution Hardening

Upgrade platform safety before deeper automation.

Focus:

- YouTube altered/synthetic disclosure wiring
- original-value guardrails in scripting
- owned/licensed dataset and voice enforcement
- distribution abstraction that can later extend beyond YouTube + Instagram

### 3.6 Shadow Validation And Cutover

Only migrate live production after shadow validation passes.

Focus:

- slot-by-slot shadow renders
- voice quality A/B comparison
- avatar realism scorecards
- performance-ledger feedback loop
- rollback-safe feature toggles

## Current Architectural Gaps Blocking A Clean Phase 3 Cutover

- `v12-factory.js` is still a large monolith and remains the true implementation core.
- The current Hindi voice path is operational but not yet "human-like premium" by Phase 3 standards.
- Current visual fallbacks still rely heavily on stock/editorial imagery and weak remote AI image paths.
- The orchestration model is slot-based and recovery-oriented, not yet fully profile-driven or agent-native.
- The project has no automated test suite protecting refactors.
- Current root project state was fragmented across `.gsd/` and `.planning/`; this file begins consolidating that state.

## Immediate Working Assumption

Phase 3 starts with additive shadow systems that can coexist with today's batch, not invasive replacement of live code paths.
