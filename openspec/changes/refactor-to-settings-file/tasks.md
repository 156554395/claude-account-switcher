## 1. Implementation
- [ ] 1.1 Create settings.json file management in ConfigManager
  - [ ] Add `getSettingsPath()` method to locate Claude settings.json
  - [ ] Add `loadSettings()` method to read current Claude settings
  - [ ] Add `saveSettings()` method to write Claude settings
  - [ ] Add `ensureSettingsFile()` method to create default settings if missing
- [ ] 1.2 Refactor switch command to modify settings.json
  - [ ] Remove environment variable export generation
  - [ ] Add settings.json modification logic
  - [ ] Preserve existing Claude settings structure
  - [ ] Add validation for settings write operations
- [ ] 1.3 Update configuration management
  - [ ] Add settings.json backup functionality
  - [ ] Implement rollback on write failures
  - [ ] Add settings file validation
- [ ] 1.4 Update CLI output and user feedback
  - [ ] Change from eval output to success message
  - [ ] Add confirmation when settings are updated
  - [ ] Add error handling for permissions issues

## 2. Testing
- [ ] 2.1 Unit tests for ConfigManager settings methods
  - [ ] Test settings file creation
  - [ ] Test settings read/write operations
  - [ ] Test backup and restore functionality
- [ ] 2.2 Integration tests for switch command
  - [ ] Test successful account switching
  - [ ] Test error handling (permissions, corruption)
  - [ ] Test with existing Claude installations
- [ ] 2.3 Manual testing scenarios
  - [ ] Test with fresh Claude installation
  - [ ] Test with existing Claude settings
  - [ ] Test account switching persistence

## 3. Documentation
- [ ] 3.1 Update README.md
  - [ ] Remove eval usage instructions
  - [ ] Add new simplified workflow
  - [ ] Update installation and usage examples
- [ ] 3.2 Update project.md
  - [ ] Update architecture patterns
  - [ ] Update environment variable constraints
  - [ ] Document new file-based approach
- [ ] 3.3 Add migration guide
  - [ ] Document changes from env var approach
  - [ ] Add troubleshooting section
  - [ ] Add FAQ for common issues