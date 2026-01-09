# AI Dev Rules CLI

Universal AI development rules installer for all IDEs and CLI tools.

## Installation

```bash
# Via npx (no install needed)
npx ai-dev-rules setup

# Global installation
npm install -g ai-dev-rules
```

## Usage

### Interactive Setup

```bash
npx ai-dev-rules setup
```

### MCP Configuration (Cursor, Claude Desktop, Kiro)

```bash
npx ai-dev-rules setup --mcp
```

### Export to Specific Format

```bash
# Cursor
npx ai-dev-rules setup --format cursor

# GitHub Copilot
npx ai-dev-rules setup --format copilot

# Claude
npx ai-dev-rules setup --format claude

# Windsurf
npx ai-dev-rules setup --format windsurf

# Zed
npx ai-dev-rules setup --format zed

# Cline
npx ai-dev-rules setup --format cline
```

### Export to All Formats

```bash
npx ai-dev-rules setup --all
```

### Update Existing Rules

```bash
npx ai-dev-rules update
```

### Verify Installation

```bash
npx ai-dev-rules verify
```

## Supported Formats

| IDE/Tool | Format | File |
|----------|--------|------|
| Cursor | cursor | `.cursorrules` |
| GitHub Copilot | copilot | `.github/copilot-instructions.md` |
| Claude | claude | `CLAUDE.md` |
| Windsurf | windsurf | `.windsurfrules` |
| Zed | zed | `.zed/rules.md` |
| Cline | cline | `.clinerules` |
| Universal | agents | `AGENTS.md` |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Invalid arguments |
| 3 | Network error |
| 4 | Permission error |
| 5 | Verification failed |

## License

MIT
