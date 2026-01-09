# PRD und Lebende Dokumentation

- Last Updated: 2025-01-09
- Description: Richtlinien für Product Requirements Documents und kontinuierliche Projektdokumentation als zentrale AI-Referenz
- Version: 1.0

## PRD-Struktur (Pflicht)

Jedes Projekt MUSS ein `/docs/PRD.md` enthalten mit:

### 1. Vision & Scope
```markdown
## Vision
[1-2 Sätze: Was ist das Produkt und warum existiert es?]

## Scope
- In Scope: [Liste der Kernfeatures]
- Out of Scope: [Explizite Ausschlüsse]
```

### 2. Business-Kontext
```markdown
## Stakeholder
- Primär: [Nutzergruppe]
- Sekundär: [Weitere Nutzer]

## Erfolgsmetriken
- KPI 1: [Messbare Metrik]
- KPI 2: [Messbare Metrik]
```

### 3. Architektur-Skizze
```markdown
## Systemarchitektur
[Mermaid-Diagramm oder ASCII-Art]

## Tech-Stack
- Frontend: [Framework, UI-Lib]
- Backend: [Runtime, Framework]
- Datenbank: [System]
- Infrastruktur: [Cloud, Services]
```

### 4. Feature-Breakdown
```markdown
## Features (nach Priorität)

### MVP (P0)
- [ ] Feature A: [Beschreibung]
  - Akzeptanzkriterien: [Liste]
  
### Post-MVP (P1)
- [ ] Feature B: [Beschreibung]
```

### 5. Akzeptanzkriterien
```markdown
## Globale Akzeptanzkriterien
- [ ] Alle Komponenten haben TypeScript-Interfaces
- [ ] Unit-Test-Coverage > 80%
- [ ] Keine TypeScript-Errors
- [ ] Lighthouse Performance > 90
```

---

## Lebende Dokumentation (Pflicht)

Der `/docs/`-Ordner MUSS diese Dateien enthalten:

| Datei | Inhalt | Update-Trigger |
|-------|--------|----------------|
| `COMPONENTS.md` | Komponentenverzeichnis mit Props/States | Neue Komponente erstellt |
| `MILESTONES.md` | Feature-Status und Releases | Feature abgeschlossen |
| `ARCHITECTURE.md` | Systemdesign-Entscheidungen | Architekturänderung |
| `DECISIONS.md` | ADRs (Architecture Decision Records) | Technische Entscheidung |
| `PATTERNS.md` | Wiederverwendbare Code-Patterns | Neues Pattern etabliert |
| `TROUBLESHOOTING.md` | Bekannte Probleme und Lösungen | Bug gelöst |

### Beispiel: COMPONENTS.md

```markdown
# Komponenten-Register

## UI-Komponenten

### Button (`components/ui/Button.vue`)
- **Props**: `variant`, `size`, `loading`, `disabled`
- **Events**: `@click`
- **Slots**: `default`, `icon`
- **Patterns**: Loading-State mit Spinner

### UserCard (`components/UserCard.vue`)
- **Props**: `user: User`, `showStatus: boolean`
- **Dependencies**: `Avatar`, `StatusBadge`
```

### Beispiel: DECISIONS.md (ADR-Format)

```markdown
# ADR-001: Nuxt 3 statt Next.js

## Status
Akzeptiert (2025-01-09)

## Kontext
Wir benötigen ein SSR-Framework für SEO.

## Entscheidung
Nuxt 3 wegen Vue-Ökosystem und Team-Expertise.

## Konsequenzen
- Positiv: Schnellere Entwicklung
- Negativ: Kleinere Community als React
```

---

## AI-Agent-Anweisung

Vor jeder Entwicklungssession:
1. Lies `/docs/PRD.md` vollständig
2. Prüfe relevante Einträge in `COMPONENTS.md` und `PATTERNS.md`
3. Nach Abschluss: Aktualisiere betroffene Dokumentation

```
"Basierend auf PRD.md Abschnitt 'Feature A' und dem Loading-Pattern 
aus PATTERNS.md, implementiere [Komponente]"
```
