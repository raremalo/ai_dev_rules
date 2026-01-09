# AI Development Rules

This directory contains unified AI agent rules compatible with dotagent.

## Structure

```
.agent/
├── rules.md          # Combined rules (auto-generated)
└── private/          # Private rules (git-ignored)
```

## Usage with dotagent

```bash
# Export to all IDE formats
dotagent export --formats all

# Export to specific format
dotagent export --format cursor
```

## Supported Formats

- Cursor (.cursorrules)
- GitHub Copilot (.github/copilot-instructions.md)
- Claude (CLAUDE.md)
- Windsurf (.windsurfrules)
- Zed (.zed/rules.md)
- Cline (.clinerules)
- Amazon Q (.amazonq/rules.md)
