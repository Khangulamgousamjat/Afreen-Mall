# Repository Utility & Maintenance Tools

This directory contains operational scripts used for repository maintenance, asset verification, and developer automation.

## Available Tools

### 1. Logo Asset Pipeline Tools
- **`copy_logos.js`**: Checks status of primary brand logo assets (`logo-dark.jpg`, `logo-light.jpg`) in `apps/web/public`.
- **`inspect_logos.js`**: Lists all static public assets and reports file sizes in KB.
- **`remove_bg.js`**: Verifies existence of dark and light theme background-processed brand logo assets.

## Execution
Run any tool from the repository root:
```bash
node tools/copy_logos.js
node tools/inspect_logos.js
node tools/remove_bg.js
```
