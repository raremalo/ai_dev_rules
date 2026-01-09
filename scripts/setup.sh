#!/bin/bash
set -e

REPO_URL="https://github.com/raremalo/ai_dev_rules"
REPO_RAW="https://raw.githubusercontent.com/raremalo/ai_dev_rules/master"

print_header() {
    echo ""
    echo "================================================"
    echo "  AI Dev Rules - Universal Setup"
    echo "================================================"
    echo ""
}

print_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  mcp          Configure MCP server (Cursor, Claude Desktop, Kiro, Windsurf)"
    echo "  dotagent     Export to all IDE formats using dotagent"
    echo "  cursor       Export to Cursor (.cursorrules)"
    echo "  copilot      Export to GitHub Copilot (.github/copilot-instructions.md)"
    echo "  claude       Export to Claude (CLAUDE.md)"
    echo "  windsurf     Export to Windsurf (.windsurfrules)"
    echo "  zed          Export to Zed (.zed/rules.md)"
    echo "  cline        Export to Cline (.clinerules)"
    echo "  all          Export to all IDE formats"
    echo "  clone        Clone repository for local development"
    echo ""
    echo "Examples:"
    echo "  $0 mcp              # Setup MCP configuration"
    echo "  $0 cursor           # Export rules to .cursorrules"
    echo "  $0 all              # Export to all formats"
    echo ""
}

setup_mcp() {
    echo "Setting up MCP configuration..."
    
    MCP_CONFIG=""
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if [ -d "$HOME/.cursor" ]; then
            MCP_CONFIG="$HOME/.cursor/mcp.json"
            echo "Detected: Cursor"
        elif [ -d "$HOME/Library/Application Support/Claude" ]; then
            MCP_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
            echo "Detected: Claude Desktop"
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -d "$HOME/.cursor" ]; then
            MCP_CONFIG="$HOME/.cursor/mcp.json"
        fi
    fi
    
    if [ -z "$MCP_CONFIG" ]; then
        echo "No MCP client detected. Please specify config path:"
        read -r MCP_CONFIG
    fi
    
    echo ""
    echo "MCP Config: $MCP_CONFIG"
    echo ""
    
    MCP_ENTRY='{
  "mcpServers": {
    "ai-dev-rules": {
      "command": "npx",
      "args": ["-y", "agent-rules-mcp@latest"],
      "env": {
        "GITHUB_OWNER": "raremalo",
        "GITHUB_REPO": "ai_dev_rules",
        "GITHUB_PATH": "rules",
        "GITHUB_BRANCH": "master"
      }
    },
    "ai-skills": {
      "command": "npx",
      "args": ["-y", "agent-rules-mcp@latest"],
      "env": {
        "GITHUB_OWNER": "raremalo",
        "GITHUB_REPO": "ai_dev_rules",
        "GITHUB_PATH": "skills",
        "GITHUB_BRANCH": "master"
      }
    }
  }
}'
    
    if [ -f "$MCP_CONFIG" ]; then
        echo "Existing config found. Add this to your mcpServers:"
        echo ""
        echo "$MCP_ENTRY"
        echo ""
        echo "Or backup and replace? (y/N)"
        read -r REPLACE
        if [[ "$REPLACE" =~ ^[Yy]$ ]]; then
            cp "$MCP_CONFIG" "$MCP_CONFIG.backup"
            echo "$MCP_ENTRY" > "$MCP_CONFIG"
            echo "Config written. Backup: $MCP_CONFIG.backup"
        fi
    else
        mkdir -p "$(dirname "$MCP_CONFIG")"
        echo "$MCP_ENTRY" > "$MCP_CONFIG"
        echo "Config written to: $MCP_CONFIG"
    fi
    
    echo ""
    echo "Done! Restart your IDE to activate MCP servers."
}

setup_dotagent() {
    echo "Setting up with dotagent..."
    
    if ! command -v dotagent &> /dev/null; then
        echo "Installing dotagent..."
        npm install -g dotagent
    fi
    
    TEMP_DIR=$(mktemp -d)
    echo "Cloning repository to $TEMP_DIR..."
    git clone --depth 1 "$REPO_URL" "$TEMP_DIR"
    
    echo "Importing rules..."
    cd "$TEMP_DIR"
    dotagent import .
    
    echo "Exporting to all formats..."
    dotagent export --formats all --no-gitignore
    
    echo ""
    echo "Copying to current directory..."
    cp -r .agent "$OLDPWD/" 2>/dev/null || true
    cp .cursorrules "$OLDPWD/" 2>/dev/null || true
    cp .windsurfrules "$OLDPWD/" 2>/dev/null || true
    cp .clinerules "$OLDPWD/" 2>/dev/null || true
    cp CLAUDE.md "$OLDPWD/" 2>/dev/null || true
    mkdir -p "$OLDPWD/.github"
    cp .github/copilot-instructions.md "$OLDPWD/.github/" 2>/dev/null || true
    mkdir -p "$OLDPWD/.zed"
    cp .zed/rules.md "$OLDPWD/.zed/" 2>/dev/null || true
    
    rm -rf "$TEMP_DIR"
    cd "$OLDPWD"
    
    echo ""
    echo "Done! Rules exported to all IDE formats."
}

export_single_format() {
    FORMAT=$1
    echo "Exporting to $FORMAT format..."
    
    TEMP_DIR=$(mktemp -d)
    git clone --depth 1 "$REPO_URL" "$TEMP_DIR"
    
    case $FORMAT in
        cursor)
            cat "$TEMP_DIR/rules/"*.md > .cursorrules
            echo "Created: .cursorrules"
            ;;
        copilot)
            mkdir -p .github
            cat "$TEMP_DIR/rules/"*.md > .github/copilot-instructions.md
            echo "Created: .github/copilot-instructions.md"
            ;;
        claude)
            cat "$TEMP_DIR/rules/"*.md > CLAUDE.md
            echo "Created: CLAUDE.md"
            ;;
        windsurf)
            cat "$TEMP_DIR/rules/"*.md > .windsurfrules
            echo "Created: .windsurfrules"
            ;;
        zed)
            mkdir -p .zed
            cat "$TEMP_DIR/rules/"*.md > .zed/rules.md
            echo "Created: .zed/rules.md"
            ;;
        cline)
            cat "$TEMP_DIR/rules/"*.md > .clinerules
            echo "Created: .clinerules"
            ;;
    esac
    
    rm -rf "$TEMP_DIR"
    echo "Done!"
}

export_all_formats() {
    echo "Exporting to all IDE formats..."
    
    TEMP_DIR=$(mktemp -d)
    git clone --depth 1 "$REPO_URL" "$TEMP_DIR"
    
    COMBINED=$(cat "$TEMP_DIR/rules/"*.md)
    
    echo "$COMBINED" > .cursorrules
    echo "Created: .cursorrules"
    
    mkdir -p .github
    echo "$COMBINED" > .github/copilot-instructions.md
    echo "Created: .github/copilot-instructions.md"
    
    echo "$COMBINED" > CLAUDE.md
    echo "Created: CLAUDE.md"
    
    echo "$COMBINED" > .windsurfrules
    echo "Created: .windsurfrules"
    
    mkdir -p .zed
    echo "$COMBINED" > .zed/rules.md
    echo "Created: .zed/rules.md"
    
    echo "$COMBINED" > .clinerules
    echo "Created: .clinerules"
    
    cp "$TEMP_DIR/AGENTS.md" ./AGENTS.md 2>/dev/null || true
    echo "Created: AGENTS.md"
    
    rm -rf "$TEMP_DIR"
    echo ""
    echo "Done! All IDE formats created."
}

clone_repo() {
    echo "Cloning repository..."
    git clone "$REPO_URL"
    echo "Done! Repository cloned to ./ai_dev_rules"
}

print_header

case "${1:-}" in
    mcp)
        setup_mcp
        ;;
    dotagent)
        setup_dotagent
        ;;
    cursor|copilot|claude|windsurf|zed|cline)
        export_single_format "$1"
        ;;
    all)
        export_all_formats
        ;;
    clone)
        clone_repo
        ;;
    *)
        print_usage
        ;;
esac
