## Context
The current implementation requires users to manually eval environment variables to switch accounts, which creates friction and temporary configuration that doesn't persist. Claude CLI already supports reading configuration from `~/.claude/settings.json`, providing a native way to manage API configuration.

## Goals / Non-Goals
- Goals:
  - Simplify account switching to a single command
  - Make account switching persistent across CLI sessions
  - Leverage Claude's native configuration mechanism
  - Maintain backward compatibility with stored accounts
  - Provide clear feedback on configuration changes
- Non-Goals:
  - Modify Claude CLI behavior
  - Change account storage format
  - Remove existing account management features

## Decisions
- Decision: Modify `~/.claude/settings.json` directly instead of using environment variables
  - Rationale: Claude CLI natively reads this file, providing seamless integration
  - Alternative considered: Create wrapper scripts (rejected - too complex)
- Decision: Keep account storage in `accounts.json` separate from `settings.json`
  - Rationale: Maintains separation of concerns (account list vs active configuration)
  - Alternative considered: Store everything in settings.json (rejected - mixing concerns)
- Decision: Create backup of settings.json before modification
  - Rationale: Safety measure to prevent corruption of user's Claude configuration
  - Alternative considered: No backup (rejected - too risky)

## Risks / Trade-offs
- Risk: Corruption of Claude settings.json → Mitigation: Always create backup before modification
- Risk: Permission issues writing to settings file → Mitigation: Clear error messages with fix suggestions
- Risk: Claude CLI may change settings.json format → Mitigation: Validate settings structure and preserve unknown fields
- Trade-off: Less portable than environment variables → Accept: Settings file approach provides better UX
- Trade-off: Requires file system access → Accept: Necessary for persistent configuration

## Migration Plan
1. User runs `claude-account use <name>` command
2. System detects current approach (env vars) and prompts for migration
3. Backup existing settings.json if it exists
4. Write new configuration to settings.json
5. Display success message with migration confirmation

## Open Questions
- Should we detect and migrate existing environment variable usage automatically?
- How to handle cases where Claude CLI is not installed but settings.json exists?
- Should we provide a command to revert to environment variable approach?