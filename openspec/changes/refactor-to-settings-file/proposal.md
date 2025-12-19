# Change: Refactor account switching to modify Claude settings.json file

## Why
The current implementation uses environment variables to switch Claude API accounts, which requires users to manually execute `eval` commands in their shell. This approach is error-prone, temporary (lost on shell restart), and creates friction in the user experience. By modifying Claude's settings.json file directly, we can provide seamless account switching that persists across CLI sessions and works transparently with Claude CLI.

## What Changes
- Remove environment variable output from switch command
- Add functionality to modify `~/.claude/settings.json` file
- Update account switching to write directly to Claude's configuration
- Maintain backward compatibility with existing account storage
- Update documentation to reflect new switching mechanism

## Impact
- Affected specs: config-management
- Affected code:
  - `src/commands/switch.js` - Remove eval output, add settings.json modification
  - `src/config/manager.js` - Add settings.json read/write methods
  - Documentation updates for new workflow
- User impact: Simplified account switching with `claude-account use <name>` command only