# Integrationsanleitung: Qoder + agent-rules-mcp

Diese Anleitung beschreibt, wie du das Regel-System sowohl mit deinem bestehenden Qoder-Setup als auch mit dem agent-rules-mcp Server nutzen kannst.

## Option 1: Nur agent-rules-mcp (Empfohlen für Team-Arbeit)

### Schritt 1: GitHub-Repository erstellen

```bash
# Neues Repository erstellen
gh repo create ai-dev-rules --public
cd ai-dev-rules

# Regeln kopieren
cp -r /pfad/zu/diesem/ordner/rules ./rules
cp README.md .

# Pushen
git add .
git commit -m "Initial rules setup"
git push origin main
```

### Schritt 2: MCP Server konfigurieren

Füge zu deiner MCP-Client-Konfiguration hinzu:

**VS Code / Cursor / Kiro / Windsurf:**
```json
{
  "mcpServers": {
    "ai-dev-rules": {
      "command": "npx",
      "args": ["-y", "agent-rules-mcp@latest"],
      "env": {
        "GITHUB_OWNER": "dein-username",
        "GITHUB_REPO": "ai-dev-rules",
        "GITHUB_PATH": "rules",
        "GITHUB_BRANCH": "main"
      }
    }
  }
}
```

### Schritt 3: Regeln nutzen

Im AI-Chat:
```
"Hole die Regel für atomic-components"
"Liste alle verfügbaren Regeldomains"
"Lade prd-documentation und ui-stack-standards Regeln"
```

---

## Option 2: Hybrid (Qoder lokal + agent-rules-mcp global)

### Schritt 1: Globale Regeln via agent-rules-mcp

Wie oben konfigurieren.

### Schritt 2: Projekt-spezifische Overrides in Qoder

```
Projekt/
├── .qoder/
│   └── rules/
│       ├── always/
│       │   └── project-specifics.md    # Immer anwenden
│       └── manual/
│           └── hotfix-rules.md          # Via @rule Befehl
```

**Beispiel: project-specifics.md**
```markdown
# Projekt-spezifische Regeln

## Stack-Overrides
- Dieses Projekt nutzt Naive UI statt Radix
- Pinia Store-Namen: `use[Entity]Store`

## Ausnahmen
- Legacy-Code in /src/legacy/ folgt alten Patterns
```

### Schritt 3: Qoder-Settings anpassen

In Qoder Settings UI:
- Regel-Typ: "always-apply" für project-specifics.md
- Regel-Typ: "manual" für Hotfix-Regeln

---

## Option 3: Nur Qoder (lokal, ohne GitHub)

### Schritt 1: Regeln kopieren

```bash
mkdir -p .qoder/rules/always
cp -r /pfad/zu/regeln/*.md .qoder/rules/always/
```

### Schritt 2: Qoder konfigurieren

- Öffne Qoder Settings
- Wähle "Add Rule" für jede Markdown-Datei
- Setze Typ auf "always-apply" für Basis-Regeln

---

## Empfehlung für dein Setup

Basierend auf deiner bestehenden Qoder-Konfiguration empfehle ich:

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                         │
│                   (ai-dev-rules/rules/)                      │
│                                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ 01-prd.md   │ │ 02-atomic.md│ │ 03-context.md│  ...      │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼ agent-rules-mcp
┌─────────────────────────────────────────────────────────────┐
│                    Alle AI-Clients                          │
│         (VS Code, Cursor, Claude, Kiro, etc.)               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Projekt A                                 │
│  .qoder/rules/                                              │
│  └── always/                                                │
│      └── project-a-overrides.md  ← Lokale Anpassungen       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Projekt B                                 │
│  .qoder/rules/                                              │
│  └── always/                                                │
│      └── project-b-overrides.md  ← Andere Anpassungen       │
└─────────────────────────────────────────────────────────────┘
```

**Vorteile:**
1. Globale Regeln zentral gepflegt
2. Änderungen sofort für alle Projekte
3. Lokale Overrides für Projekt-Spezifika
4. Git-History für Regeländerungen
5. Team-weite Konsistenz

---

## Migration von bestehenden Qoder-Regeln

Falls du bereits Regeln in Qoder hast:

1. Exportiere sie nach `rules/`
2. Passe Format an (siehe CONTRIBUTING.md)
3. Pushe zu GitHub
4. Konfiguriere agent-rules-mcp
5. Entferne Duplikate aus lokalem Qoder

---

## Troubleshooting

### MCP Server startet nicht
```bash
# Prüfe npx
which npx

# Manuell testen
npx -y agent-rules-mcp@latest
```

### Regeln werden nicht gefunden
- Prüfe GitHub-Repo-Visibility (public oder Token nötig)
- Prüfe GITHUB_PATH (muss exakt stimmen)
- Prüfe Branch-Name

### Lokale Regeln überschreiben globale nicht
- Qoder-Regeln haben immer Vorrang vor MCP
- Verwende explizite Overrides in lokalen Regeln
