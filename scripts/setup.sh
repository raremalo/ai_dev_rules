#!/bin/bash
set -e

VERSION="1.0.0"
REPO_URL="https://github.com/raremalo/ai_dev_rules"
REPO_RAW="https://raw.githubusercontent.com/raremalo/ai_dev_rules/master"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

EXIT_SUCCESS=0
EXIT_ERROR=1
EXIT_INVALID_ARGS=2
EXIT_NETWORK_ERROR=3
EXIT_PERMISSION_ERROR=4
EXIT_VERIFY_FAILED=5

print_header() {
    echo ""
    echo "================================================"
    echo "  AI Dev Rules Setup v${VERSION}"
    echo "================================================"
    echo ""
}

print_usage() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  setup              Interactive setup wizard"
    echo "  mcp                Configure MCP server (Cursor, Claude Desktop, Kiro)"
    echo "  cursor             Export to Cursor (.cursorrules)"
    echo "  copilot            Export to GitHub Copilot (.github/copilot-instructions.md)"
    echo "  claude             Export to Claude (CLAUDE.md)"
    echo "  windsurf           Export to Windsurf (.windsurfrules)"
    echo "  zed                Export to Zed (.zed/rules.md)"
    echo "  cline              Export to Cline (.clinerules)"
    echo "  all                Export to all IDE formats"
    echo "  verify             Verify installation"
    echo "  help               Show this help"
    echo ""
    echo "Options:"
    echo "  --no-verify        Skip verification step"
    echo "  --yes, -y          Auto-confirm prompts"
    echo ""
    echo "Recommended (secure) usage:"
    echo "  # Step 1: Download script"
    echo "  curl -fsSL ${REPO_RAW}/scripts/setup.sh -o /tmp/ai-dev-rules-setup.sh"
    echo ""
    echo "  # Step 2: Review script (security best practice)"
    echo "  less /tmp/ai-dev-rules-setup.sh"
    echo ""
    echo "  # Step 3: Execute"
    echo "  bash /tmp/ai-dev-rules-setup.sh [COMMAND]"
    echo ""
    echo "Alternative (requires Node.js):"
    echo "  npx ai-dev-rules setup"
    echo ""
}

check_network() {
    if ! curl -s --head --connect-timeout 5 "https://github.com" > /dev/null 2>&1; then
        echo -e "${RED}Fehler: Keine Internetverbindung oder GitHub nicht erreichbar${NC}"
        exit $EXIT_NETWORK_ERROR
    fi
}

check_permissions() {
    local target_dir="${1:-.}"
    if [ ! -w "$target_dir" ]; then
        echo -e "${RED}Fehler: Keine Schreibrechte in $target_dir${NC}"
        exit $EXIT_PERMISSION_ERROR
    fi
}

fetch_rules() {
    local temp_dir
    temp_dir=$(mktemp -d)
    
    echo -e "${BLUE}Lade Regeln von GitHub...${NC}"
    
    if ! git clone --depth 1 --quiet "$REPO_URL" "$temp_dir" 2>/dev/null; then
        echo -e "${RED}Fehler: Konnte Repository nicht klonen${NC}"
        rm -rf "$temp_dir"
        exit $EXIT_NETWORK_ERROR
    fi
    
    echo "$temp_dir"
}

verify_file() {
    local file="$1"
    if [ -f "$file" ] && [ -s "$file" ]; then
        local size
        size=$(wc -c < "$file" | tr -d ' ')
        echo -e "${GREEN}✓${NC} $(basename "$file") erstellt (${size} bytes)"
        return 0
    else
        echo -e "${RED}✗${NC} $(basename "$file") - Fehler"
        return 1
    fi
}

verify_json() {
    local file="$1"
    if [ -f "$file" ]; then
        if python3 -c "import json; json.load(open('$file'))" 2>/dev/null || \
           node -e "require('$file')" 2>/dev/null; then
            echo -e "${GREEN}✓${NC} $(basename "$file") - valides JSON"
            return 0
        else
            echo -e "${RED}✗${NC} $(basename "$file") - ungültiges JSON"
            return 1
        fi
    fi
    return 1
}

setup_mcp() {
    echo -e "${BLUE}Konfiguriere MCP Server...${NC}"
    
    local config_path=""
    
    if [ -d "$HOME/.cursor" ]; then
        config_path="$HOME/.cursor/mcp.json"
        echo "Erkannt: Cursor"
    elif [ -d "$HOME/Library/Application Support/Claude" ]; then
        config_path="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
        echo "Erkannt: Claude Desktop"
    fi
    
    if [ -z "$config_path" ]; then
        echo -e "${YELLOW}Kein MCP-Client erkannt.${NC}"
        read -rp "Pfad zur Config-Datei (oder Enter für ~/.cursor/mcp.json): " config_path
        config_path="${config_path:-$HOME/.cursor/mcp.json}"
    fi
    
    local mcp_config='{
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
    
    if [ -f "$config_path" ]; then
        if [ "$AUTO_YES" != "true" ]; then
            echo -e "${YELLOW}Existierende Config gefunden: $config_path${NC}"
            read -rp "Backup erstellen und zusammenführen? (j/N): " confirm
            if [[ ! "$confirm" =~ ^[jJyY]$ ]]; then
                echo "Abgebrochen."
                exit $EXIT_SUCCESS
            fi
        fi
        
        local backup_path="${config_path}.backup.$(date +%s)"
        cp "$config_path" "$backup_path"
        echo -e "${GREEN}Backup: $backup_path${NC}"
        
        if command -v jq &> /dev/null; then
            jq -s '.[0] * .[1]' "$config_path" <(echo "$mcp_config") > "${config_path}.tmp"
            mv "${config_path}.tmp" "$config_path"
        else
            echo "$mcp_config" > "$config_path"
            echo -e "${YELLOW}Warnung: jq nicht installiert, Config wurde ersetzt (nicht zusammengeführt)${NC}"
        fi
    else
        mkdir -p "$(dirname "$config_path")"
        echo "$mcp_config" > "$config_path"
    fi
    
    echo -e "${GREEN}MCP-Konfiguration erstellt: $config_path${NC}"
    echo ""
    echo -e "${YELLOW}Bitte IDE neu starten um MCP-Server zu aktivieren.${NC}"
    
    if [ "$SKIP_VERIFY" != "true" ]; then
        echo ""
        verify_json "$config_path"
    fi
}

export_format() {
    local format="$1"
    local filename="$2"
    local target_dir="${3:-.}"
    
    check_permissions "$target_dir"
    
    local temp_dir
    temp_dir=$(fetch_rules)
    
    local target_path
    
    case "$format" in
        copilot)
            mkdir -p "$target_dir/.github"
            target_path="$target_dir/.github/copilot-instructions.md"
            ;;
        zed)
            mkdir -p "$target_dir/.zed"
            target_path="$target_dir/.zed/rules.md"
            ;;
        *)
            target_path="$target_dir/$filename"
            ;;
    esac
    
    cat "$temp_dir/rules/"*.md > "$target_path"
    
    rm -rf "$temp_dir"
    
    if [ "$SKIP_VERIFY" != "true" ]; then
        verify_file "$target_path"
    else
        echo -e "${GREEN}Erstellt: $target_path${NC}"
    fi
}

export_all() {
    local target_dir="${1:-.}"
    
    check_permissions "$target_dir"
    
    local temp_dir
    temp_dir=$(fetch_rules)
    
    local combined
    combined=$(cat "$temp_dir/rules/"*.md)
    
    echo "$combined" > "$target_dir/.cursorrules"
    mkdir -p "$target_dir/.github"
    echo "$combined" > "$target_dir/.github/copilot-instructions.md"
    echo "$combined" > "$target_dir/CLAUDE.md"
    echo "$combined" > "$target_dir/.windsurfrules"
    mkdir -p "$target_dir/.zed"
    echo "$combined" > "$target_dir/.zed/rules.md"
    echo "$combined" > "$target_dir/.clinerules"
    
    if [ -f "$temp_dir/AGENTS.md" ]; then
        cp "$temp_dir/AGENTS.md" "$target_dir/AGENTS.md"
    fi
    
    rm -rf "$temp_dir"
    
    echo -e "${GREEN}Alle Formate exportiert:${NC}"
    
    if [ "$SKIP_VERIFY" != "true" ]; then
        verify_file "$target_dir/.cursorrules"
        verify_file "$target_dir/.github/copilot-instructions.md"
        verify_file "$target_dir/CLAUDE.md"
        verify_file "$target_dir/.windsurfrules"
        verify_file "$target_dir/.zed/rules.md"
        verify_file "$target_dir/.clinerules"
        [ -f "$target_dir/AGENTS.md" ] && verify_file "$target_dir/AGENTS.md"
    fi
}

run_verify() {
    echo -e "${BLUE}Prüfe Installation...${NC}"
    echo ""
    
    local has_files=false
    local all_ok=true
    
    [ -f ".cursorrules" ] && { has_files=true; verify_file ".cursorrules" || all_ok=false; }
    [ -f ".github/copilot-instructions.md" ] && { has_files=true; verify_file ".github/copilot-instructions.md" || all_ok=false; }
    [ -f "CLAUDE.md" ] && { has_files=true; verify_file "CLAUDE.md" || all_ok=false; }
    [ -f ".windsurfrules" ] && { has_files=true; verify_file ".windsurfrules" || all_ok=false; }
    [ -f ".zed/rules.md" ] && { has_files=true; verify_file ".zed/rules.md" || all_ok=false; }
    [ -f ".clinerules" ] && { has_files=true; verify_file ".clinerules" || all_ok=false; }
    [ -f "AGENTS.md" ] && { has_files=true; verify_file "AGENTS.md" || all_ok=false; }
    
    local mcp_config=""
    [ -f "$HOME/.cursor/mcp.json" ] && mcp_config="$HOME/.cursor/mcp.json"
    [ -f "$HOME/Library/Application Support/Claude/claude_desktop_config.json" ] && \
        mcp_config="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
    
    if [ -n "$mcp_config" ]; then
        has_files=true
        verify_json "$mcp_config" || all_ok=false
    fi
    
    echo ""
    echo "────────────────────────────────────"
    
    if [ "$has_files" = false ]; then
        echo -e "${YELLOW}Keine Regel-Dateien gefunden.${NC}"
        echo "Führe 'setup.sh all' oder 'npx ai-dev-rules setup' aus."
        exit $EXIT_VERIFY_FAILED
    elif [ "$all_ok" = true ]; then
        echo -e "${GREEN}Installation erfolgreich!${NC}"
        exit $EXIT_SUCCESS
    else
        echo -e "${YELLOW}Installation mit Warnungen abgeschlossen.${NC}"
        exit $EXIT_VERIFY_FAILED
    fi
}

interactive_setup() {
    echo "Was möchtest du einrichten?"
    echo ""
    echo "  1) MCP Server (Cursor, Claude Desktop, Kiro)"
    echo "  2) Ein IDE-Format exportieren"
    echo "  3) Alle IDE-Formate exportieren"
    echo ""
    read -rp "Auswahl (1-3): " choice
    
    case "$choice" in
        1)
            setup_mcp
            ;;
        2)
            echo ""
            echo "Welches Format?"
            echo ""
            echo "  1) Cursor (.cursorrules)"
            echo "  2) GitHub Copilot (.github/copilot-instructions.md)"
            echo "  3) Claude (CLAUDE.md)"
            echo "  4) Windsurf (.windsurfrules)"
            echo "  5) Zed (.zed/rules.md)"
            echo "  6) Cline (.clinerules)"
            echo ""
            read -rp "Auswahl (1-6): " format_choice
            
            case "$format_choice" in
                1) export_format "cursor" ".cursorrules" ;;
                2) export_format "copilot" "" ;;
                3) export_format "claude" "CLAUDE.md" ;;
                4) export_format "windsurf" ".windsurfrules" ;;
                5) export_format "zed" "" ;;
                6) export_format "cline" ".clinerules" ;;
                *) echo -e "${RED}Ungültige Auswahl${NC}"; exit $EXIT_INVALID_ARGS ;;
            esac
            ;;
        3)
            export_all
            ;;
        *)
            echo -e "${RED}Ungültige Auswahl${NC}"
            exit $EXIT_INVALID_ARGS
            ;;
    esac
}

SKIP_VERIFY=false
AUTO_YES=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --no-verify)
            SKIP_VERIFY=true
            shift
            ;;
        --yes|-y)
            AUTO_YES=true
            shift
            ;;
        *)
            break
            ;;
    esac
done

print_header
check_network

case "${1:-setup}" in
    setup)
        interactive_setup
        ;;
    mcp)
        setup_mcp
        ;;
    cursor)
        export_format "cursor" ".cursorrules"
        ;;
    copilot)
        export_format "copilot" ""
        ;;
    claude)
        export_format "claude" "CLAUDE.md"
        ;;
    windsurf)
        export_format "windsurf" ".windsurfrules"
        ;;
    zed)
        export_format "zed" ""
        ;;
    cline)
        export_format "cline" ".clinerules"
        ;;
    all)
        export_all
        ;;
    verify)
        run_verify
        ;;
    help|--help|-h)
        print_usage
        ;;
    *)
        echo -e "${RED}Unbekannter Befehl: $1${NC}"
        echo ""
        print_usage
        exit $EXIT_INVALID_ARGS
        ;;
esac
