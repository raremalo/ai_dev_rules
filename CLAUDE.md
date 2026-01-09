# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a **rule system for AI-assisted software development** with persistent memory (Cognee), task tracking (Beads), skills, and hooks. The rules are served via MCP (Model Context Protocol) to AI clients like Claude, Cursor, or Kiro.

## Repository Structure

```
ai-dev-rules/
├── rules/                  # Core rules (01-18) - served via agent-rules-mcp
├── skills/                 # Reusable AI workflow templates
│   └── creation/           # Skills for creating files/components
├── templates/              # Project templates (CLAUDE.md.template)
├── docs/                   # Extended architecture documentation
├── mcp-config.json         # Minimal MCP configuration
└── mcp-config-full.json    # Full configuration with Cognee + Beads
```

## Key Integrations

### MCP Servers
- **agent-rules-mcp**: Serves rules and skills from GitHub
- **cognee-mcp**: Persistent AI memory via knowledge graph (cognify, codify, search)
- **beads-mcp**: DAG-based task tracking with dependencies

### Local Overrides
Project-specific rules go in `.qoder/rules/always/` to override global rules.

## Content Guidelines

When editing rules or skills in this repository:

### Rule Files (rules/*.md)
- Include metadata header: Last Updated, Description, Version
- Use German language (repository convention)
- Structure: Kernprinzip → Sections → Checkliste
- Include practical examples with code blocks
- Reference other rules by number (e.g., "[02-atomic-components]")

### Skills (skills/*/*.md)
Follow the skill template structure from `rules/15-skills-system.md`.

### CLAUDE.md Template
The template in `templates/CLAUDE.md.template` provides the recommended structure for project-specific CLAUDE.md files.

## Key Concepts

### Session Lifecycle
1. **Start**: Load rules, query Cognee memory, get ready tasks via `bd ready --json`
2. **During**: Apply rules, update task status, save patterns
3. **End**: Create tasks for remaining work, close completed tasks, `bd sync && git push`

### Strong Emphasis Words
Rules use WICHTIG/NIEMALS/IMMER (IMPORTANT/NEVER/ALWAYS) to enforce critical patterns.

### Rule Acknowledgment Pattern
For complex tasks, AI should list which rules are being applied before implementation.
