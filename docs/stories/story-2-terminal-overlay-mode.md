# Terminal Overlay Window Experience - Brownfield Addition

## User Story

As a **user who clicked the terminal preview**,  
I want **the terminal to open as a windowed overlay with light transparency over the website**,  
So that **I get an authentic terminal desktop application experience while maintaining context of the underlying website**.

## Story Context

**Existing System Integration:**
- Integrates with: Existing Terminal.tsx component and current boot sequence
- Technology: React 18 + TypeScript, CSS transforms, fixed positioning, backdrop blur
- Follows pattern: Existing Terminal component architecture with useState hooks and audio integration
- Touch points: Terminal component, audio system, escape key handling, localStorage session removal

## Acceptance Criteria

**Functional Requirements:**

1. **Overlay Positioning:** Terminal renders as fixed overlay with light margins and subtle transparency backdrop
2. **Terminal Window Frame:** Visual terminal window frame with title bar, close button, and authentic desktop app appearance  
3. **Boot Sequence Preservation:** Existing Terminal boot sequence, greeting, and audio system function identically in overlay mode

**Integration Requirements:**

4. Existing Terminal component boot timing, animation sequences, and audio effects remain unchanged
5. Remove localStorage session tracking dependency (terminal_visited, terminal_experienced) - all launches from homepage context
6. Escape key and close button return user seamlessly to HomePage without navigation

**Quality Requirements:**

7. Overlay performance is smooth with proper backdrop blur and transparency effects
8. Terminal window is properly sized and centered across different screen sizes
9. No memory leaks when opening/closing overlay multiple times

## Technical Notes

- **Integration Approach:** Enhance Terminal.tsx with overlay mode prop, add CSS for windowed appearance and backdrop
- **Existing Pattern Reference:** Preserve all existing Terminal state management (useState hooks), audio integration, analytics tracking
- **Key Constraints:** Must maintain Terminal boot sequence timing, preserve audio system integration, avoid localStorage dependencies

## Definition of Done

- [x] Terminal opens as authentic windowed overlay with proper margins and transparency
- [x] Existing boot sequence, greeting, audio effects function identically in overlay mode
- [x] localStorage session tracking removed - no dependency on terminal_visited flags
- [x] Escape key and close button return to HomePage smoothly
- [x] Terminal window appearance is professional and desktop-app-like
- [x] Cross-browser compatibility maintained for overlay effects and backdrop blur

## Risk and Compatibility Check

**Minimal Risk Assessment:**
- **Primary Risk:** Breaking existing Terminal boot sequence or audio system integration
- **Mitigation:** Add overlay mode as enhancement, preserve all existing Terminal functionality paths
- **Rollback:** Disable overlay mode with feature flag, revert to current Terminal route behavior

**Compatibility Verification:**
- [x] No breaking changes to existing Terminal component boot sequence or timing
- [x] Audio system integration (useAudioManager) remains unchanged
- [x] Analytics tracking patterns preserved with addition of overlay-specific events
- [x] CSS overlay effects are additive only, no modifications to existing Terminal styles

## Validation Checklist

**Scope Validation:**
- [x] Story can be completed in one development session (4-6 hours)
- [x] Integration approach builds on existing Terminal component architecture
- [x] Follows existing Terminal component patterns (hooks, audio, analytics)
- [x] No new architecture required - enhancement of existing component

**Clarity Check:**
- [x] Story requirements clearly specify overlay behavior and window appearance
- [x] Integration points are specific (Terminal.tsx, CSS positioning, audio system)
- [x] Success criteria include existing functionality preservation
- [x] Rollback approach is straightforward (feature flag disable)