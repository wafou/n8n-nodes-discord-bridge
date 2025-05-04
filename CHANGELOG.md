# Changelog

## [0.1.0] - 2024-03-19

### Initial

- Fork of the original project [n8n-nodes-discord](https://github.com/edbrdi/n8n-nodes-discord)
- Project renamed to `n8n-nodes-discord-bridge`

### Added

- Discord reactions support (add/remove)
  - New "Reaction" trigger type in Discord Trigger node
  - Added `reactionEmoji` and `reactionAction` fields in returned data
  - Ability to filter reactions by channel and role
  - Support for standard and custom emojis
- Documentation updates
  - Added documentation for reaction features
  - Description of emoji filters and reaction event types
  - Full translation to English with AI assistance
