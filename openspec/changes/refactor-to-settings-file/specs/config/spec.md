## MODIFIED Requirements

### Requirement: Account Switching
The system SHALL update Claude's settings.json file with the selected account configuration, persisting the active account across CLI sessions.

#### Scenario: Successful account switch
- **WHEN** user runs `claude-account use <account-name>`
- **THEN** the system SHALL update `~/.claude/settings.json` with the account's API configuration
- **AND** display a success message confirming the active account

#### Scenario: Account switch with API URL
- **WHEN** user switches to an account with a custom API URL
- **THEN** the system SHALL write the API URL to settings.json
- **AND** preserve any other existing Claude settings

#### Scenario: Account switch with model configuration
- **WHEN** user switches to an account with specified models
- **THEN** the system SHALL write the model configurations to settings.json
- **AND** merge with any existing model preferences

### Requirement: Settings File Management
The system SHALL safely manage Claude's settings.json file, preserving existing configuration and providing backup functionality.

#### Scenario: First-time account switch
- **WHEN** settings.json does not exist
- **THEN** the system SHALL create a new settings.json with the account configuration
- **AND** set appropriate file permissions (600)

#### Scenario: Preserving existing settings
- **WHEN** settings.json exists with other configurations
- **THEN** the system SHALL preserve all non-API related settings
- **AND** only update API key, URL, and model fields

#### Scenario: Backup before modification
- **WHEN** modifying existing settings.json
- **THEN** the system SHALL create a backup of the original file
- **AND** store it in the same directory with a timestamp suffix

#### Scenario: Settings file write error
- **WHEN** unable to write to settings.json due to permissions
- **THEN** the system SHALL display a clear error message
- **AND** provide instructions to fix the permission issue

### Requirement: Configuration Validation
The system SHALL validate settings.json structure and content before and after modifications.

#### Scenario: Invalid settings structure
- **WHEN** settings.json has invalid JSON structure
- **THEN** the system SHALL attempt to repair the file
- **AND** notify the user of the repair action

#### Scenario: Settings restoration
- **WHEN** settings modification fails
- **THEN** the system SHALL restore from the backup file
- **AND** report the failure to the user

## REMOVED Requirements

### Requirement: Environment Variable Output
**Reason**: The new approach directly modifies Claude's configuration file instead of outputting environment variables for manual execution.
**Migration**: Users no longer need to use `eval` or manually export environment variables.

#### Scenario: Environment variable generation
- **REMOVED**: Previously when switching accounts, the system would output export commands for environment variables
- **Migration**: Account switching now automatically updates Claude's configuration file

## ADDED Requirements

### Requirement: Settings File Detection
The system SHALL detect and handle various Claude installation scenarios and settings file locations.

#### Scenario: Multiple Claude installations
- **WHEN** multiple potential settings.json locations exist
- **THEN** the system SHALL use the primary location in the user's home directory
- **AND** warn the user if other configurations are detected

#### Scenario: Claude CLI not installed
- **WHEN** Claude CLI is not detected on the system
- **THEN** the system SHALL still create/update settings.json
- **AND** inform the user that the configuration will be ready when Claude CLI is installed