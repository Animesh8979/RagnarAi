# Requirements

## Purpose

This document merges the repo's current working production requirements with the new Phase 3 architectural target.

It is intentionally non-destructive:

- current production behavior is preserved as the baseline
- obsolete or conflicting components are marked as migration targets
- Phase 3 requirements are framed so they can be implemented without damaging today's live batch

## Current Production Baseline Requirements

The following requirements remain in force:

1. The pipeline must continue supporting daily vertical output for YouTube Shorts and Instagram Reels.
2. The active production entrypoint remains the V15 runtime surface (`v15-factory.js`) backed by the current V12 implementation core.
3. Existing recovery and monitoring behavior must stay intact:
   - run state files
   - recovery queue
   - circuit breakers
   - post-upload review
   - performance ledger
4. The system must continue functioning in a mostly headless Node.js environment using Remotion + FFmpeg for assembly.
5. Any Phase 3 work must be deployable behind flags, adapters, or shadow paths before live cutover.

## Phase 3 Architectural Requirements

### 1. Core Architecture And Philosophy

- The system target remains "video-as-code".
- The primary runtime remains headless and automation-first.
- The framework must move toward specialized agents that improve future videos using performance data.
- The orchestration model must become profile-driven through a Niche Profile contract that controls:
  - script structure
  - pacing
  - avatar style
  - caption style
  - typography
  - channel-specific packaging rules

### 2. Voice Artist Agent

Phase 3 voice requirements:

- Kokoro-82M is the target base TTS direction for controllable narration.
- Script payloads must support paralinguistic tags such as `[laugh]`, `[sigh]`, `[cough]`.
- Script payloads must support stress markers for urgency/emphasis.
- Voice quality must trend toward a single recognizable, owned narrator identity per channel/profile.
- Hindi and multilingual QA must be explicit; English-only ASR assumptions are not acceptable for Hindi validation.

Operational constraints:

- The current live Hindi stack may remain active until the Phase 3 voice path is validated.
- Voice cloning of third-party actors or unlicensed public figures is not allowed as a default product path.
- Only owned or clearly licensed narrator voices are acceptable for production use.

Licensing gap to resolve:

- The requested `rvc-no-gui` path is a strong technical match for headless automation, but its published repository is GPL v3, which conflicts with the stated Phase 3 legal preference for Apache 2.0/MIT style production dependencies.
- Therefore, `rvc-no-gui` is approved only as a research/reference candidate for Phase 3 planning right now, not as a default shipping dependency until legal posture is resolved or a compliant alternative/isolation strategy is chosen.

### 3. Visual Director Agent

Phase 3 visual requirements:

- Storytelling and presenter-led news must move toward a character-locked visual identity.
- Static portrait + driving motion must be the baseline animation input contract.
- Avatar animation should be integrated via a sidecar or modular path, not by rewriting the current live renderer first.
- Restoration/upscale stages such as GFPGAN/CodeFormer may be used where legally and operationally acceptable.

Commercial safety constraint:

- LivePortrait itself is MIT-licensed, but its upstream license notes that InsightFace models are non-commercial research only and must be replaced for commercial use.
- Therefore, any commercial/default Phase 3 avatar path must avoid shipping with the non-commercial InsightFace model assets still attached.

### 4. Verticals v3 Framework

Required agent roles:

- News Agent: trend/search/RSS grounding
- Story Architect: 50-60 second high-retention script generation
- Editor Bot: JSON-templated assembly via Node.js-first tooling
- Manager Agent: distribution and compliance handling

Integration rule:

- The existing `run-today.js` slot runner remains the stability anchor until the new agent contracts are validated.
- Phase 3 orchestration must first wrap or feed the current pipeline before attempting a full replacement.

### 5. Programmatic Assembly And Retention Editing

Phase 3 editing requirements:

- Timelines should be representable as structured JSON contracts.
- Captions should support word-level timing and on-video emphasis.
- Pattern interrupts should be first-class editing controls.
- Loop endings should be authored intentionally for replayability.
- Thumbnail strategy should follow a strict focal-point / contrast / minimal-words contract.

Required retention behaviors to support:

- scale or visual reset intervals
- power-word overlays
- progressive rhythm pacing
- replay-loop handoff from ending back into hook

### 6. Compliance, Legal, And Platform Safety

- The YouTube upload path must support altered/synthetic content disclosure where required.
- Scripting must preserve an "original value" requirement so the pipeline does not drift into low-value inauthentic content.
- Only owned, licensed, or commercially safe assets may be production defaults.
- If a model or asset is operationally strong but legally unsafe, it must be isolated as research-only until replaced.

### 7. Distribution Scope

- The current mandatory platforms remain YouTube and Instagram.
- Future Manager Agent expansion may include TikTok, but TikTok is not a required cutover dependency for the first atomic Phase 3 step.

## Phase 3 Use-Case Contract Captured From Current Request

The user supplied a desired output shape for a high-retention vertical script. That is now captured as a formal requirement for future Phase 3 script-agent work:

- Target runtime: about 50 seconds
- Output format: structured JSON
- Required keys:
  - `Hook_Text`
  - `Voiceover_Script`
  - `Visual_Cues`
  - `BGM_Prompt`
  - `Pattern_Interrupts`
- Persona assumptions:
  - avatar generated with Flux-style character consistency
  - voice built around Kokoro-82M direction plus a controlled conversion layer
  - animation path aligned to LivePortrait/ComfyUI-style motion driving
- Narrative objective:
  - warning-formula hook
  - strong truth-bomb opening
  - loopable ending that reconnects to the intro

This output contract should be implemented first as a shadow generator or sidecar prompt builder, not by directly replacing the current live script generator.

## Deprecated, Conflicting, Or Transitional Components

The following are now considered transitional rather than target-state components:

- `pipeline.js`: legacy orchestration path relative to `run-today.js` / `scheduler.js`
- `v12-factory.js`: still the core engine, but no longer an acceptable end-state architecture
- direct Hindi dependence on Edge/Google fallback voices as the premium storytelling endpoint
- weak remote AI image fallbacks as the long-term story visual strategy
- fragmented state documentation living only in `.gsd/` and `.planning/`

## Missing Dependencies Or Capability Gaps

The current repo does not yet contain production-ready integration for:

- a commercial-safe RVC/voice-conversion layer
- LivePortrait sidecar orchestration in the Node pipeline
- GFPGAN/CodeFormer upgrade stage
- character-locked Flux/LoRA asset workflow
- Niche Profile contracts
- JSON timeline abstraction at the Phase 3 level
- synthetic media disclosure support in the upload layer
- automated regression tests protecting migration work

## Architectural Bottlenecks

- `v12-factory.js` is the main refactor bottleneck.
- Voice, media sourcing, assembly, QA, and reporting are too tightly coupled.
- The current avatar path is a visual layer, not a full Phase 3 talking-avatar system.
- Current quality scoring exists, but agentic learning loops are still limited.
- Current batch orchestration is robust operationally, but not yet modular enough for seamless Phase 3 swaps.

## First Atomic Execution Constraint

The first atomic implementation step of Phase 3 must:

1. avoid modifying the live batch runner behavior
2. avoid changing the current uploader path
3. create a shadow/sidecar Voice Artist Agent foundation
4. resolve licensing and interface boundaries before implementation expands into avatars or orchestration

This makes the Voice Artist Agent foundation the safest first execution slice.
