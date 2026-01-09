# AI Delegation Patterns

- Last Updated: 2025-01-09
- Description: Strategien für effektive Aufgabenverteilung zwischen Mensch und AI-Assistant
- Version: 1.0
- Source: Community-validated from coding-with-ai.dev

## Kernprinzip

**Handle Critical Parts, Delegate the Rest.** Schreibe kritische, komplexe Code-Teile selbst und delegiere den Rest.

---

## Delegation Matrix

### ✅ An AI delegieren (Offload Tedious Tasks - 64% essential)

| Aufgabe | Beispiel | Warum gut für AI |
|---------|----------|------------------|
| **Boilerplate** | CRUD-Endpoints, Form-Komponenten | Repetitiv, klare Patterns |
| **Refactoring** | Variable umbenennen, Imports sortieren | Systematisch, fehleranfällig für Menschen |
| **Migrationen** | JS → TS, Options → Composition API | Zeitaufwändig, regelbasiert |
| **Tests schreiben** | Unit-Tests für bestehende Funktionen | Gut spezifizierbar |
| **Dokumentation** | JSDoc, README-Sections | Strukturiert, repetitiv |
| **Regex erstellen** | E-Mail-Validierung, URL-Parsing | AI ist besser darin |
| **SQL-Queries** | Komplexe JOINs, Aggregationen | Syntax-intensiv |
| **Config-Dateien** | Webpack, ESLint, TypeScript | Viel Boilerplate |

### 🧠 Selbst machen (Brain First)

| Aufgabe | Warum selbst? |
|---------|---------------|
| **Architektur-Entscheidungen** | Langfristige Konsequenzen |
| **Security-kritischer Code** | AI kann Lücken übersehen |
| **Business-Logik Kernstück** | Domänenwissen erforderlich |
| **Performance-kritische Pfade** | Benchmarking nötig |
| **Fehlerbehandlungs-Strategie** | UX-Entscheidungen |

---

## Delegations-Workflow

### Pattern 1: Structure → Implementation

```markdown
AI-Anfrage:
"Ich gebe dir die Struktur, du füllst die Implementation:

```typescript
// Meine Struktur:
interface PaymentService {
  processPayment(order: Order): Promise<PaymentResult>
  refund(transactionId: string): Promise<RefundResult>
  getHistory(userId: string, limit?: number): Promise<Payment[]>
}

// Implementiere diese Methoden mit:
// - Stripe SDK für Zahlungen
// - Exponential Backoff bei Fehlern
// - Logging für jede Operation
```"
```

### Pattern 2: Critical → Rest

```markdown
"Ich habe die kritische Auth-Logik geschrieben:

```typescript
// MEIN CODE - NICHT ÄNDERN:
function validateToken(token: string): TokenPayload {
  // [meine sichere Implementation]
}
```

Basierend darauf, erstelle:
1. Login-Endpoint der validateToken nutzt
2. Middleware für protected Routes
3. Token-Refresh Mechanismus"
```

### Pattern 3: Tedious Migration

```markdown
"Migriere alle Dateien in /src/components/ von:
- Options API → Composition API
- JavaScript → TypeScript
- Class Components → Functional

Behalte die Logik exakt bei, ändere nur die Syntax.
Zeige mir jeden File einzeln zur Bestätigung."
```

---

## Debugging Delegation

### Log Everything for AI Debugging (35% essential)

Systeme so designen, dass AI Logs lesen kann:

```typescript
// logger.ts - AI-freundliches Logging
const logger = {
  debug: (context: string, data: object) => {
    console.log(JSON.stringify({
      level: 'DEBUG',
      timestamp: new Date().toISOString(),
      context,
      ...data
    }))
  },
  
  error: (context: string, error: Error, data?: object) => {
    console.error(JSON.stringify({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      context,
      error: error.message,
      stack: error.stack,
      ...data
    }))
  }
}
```

### AI-Anfrage für Debugging

```markdown
"Hier sind die Logs der letzten 5 Minuten:

[LOGS EINFÜGEN]

Analysiere:
1. Was ist das Problem?
2. Wo tritt es auf?
3. Was ist die wahrscheinliche Ursache?
4. Wie kann ich es fixen?"
```

### Let It Test and Fix Itself

```markdown
"Implementiere [Feature] mit diesem Workflow:
1. Schreibe den Code
2. Führe `npm test` aus
3. Wenn Tests fehlschlagen: analysiere Output und fixe
4. Wiederhole bis alle Tests grün
5. Zeige mir das finale Ergebnis"
```

---

## Pivot When Stuck

### Erkennungszeichen

Der Agent ist stuck wenn:
- 3+ Versuche für gleiches Problem
- Wiederholt gleiche fehlerhafte Lösung
- Wird langsamer / weniger kohärent
- Halluziniert APIs die nicht existieren

### Pivot-Strategie

```markdown
"STOPP. Wir drehen uns im Kreis.

Vergiss den bisherigen Ansatz. Lass uns neu denken:

1. Was ist das eigentliche Problem? (nicht das Symptom)
2. Welche komplett anderen Ansätze gibt es?
3. Gibt es eine einfachere Lösung?

Schlage 3 alternative Ansätze vor."
```

### Fallback: Selbst übernehmen

```markdown
"Ich übernehme hier selbst. Erkläre mir stattdessen:
1. Wie funktioniert [relevantes Konzept]?
2. Was sind typische Patterns für [Problem]?
3. Welche Edge-Cases muss ich beachten?"
```

---

## Subagent Pattern

### Aufgaben aufteilen

```markdown
"Nutze Subagents für diese Aufgabe:

Subagent 1: Analysiere die bestehende API-Struktur
Subagent 2: Recherchiere Best Practices für [Thema]
Subagent 3: Überprüfe die vorgeschlagene Lösung

Fasse die Erkenntnisse zusammen."
```

### Double-Check mit frischem Context

```markdown
Workflow:
1. Agent A: Implementiert Feature
2. /clear (Context leeren)
3. Agent B: "Reviewe diesen Code: [Code von Agent A]"
4. Agent A: Implementiert Feedback von Agent B
```

---

## Async Delegation

### Agent arbeitet während du anderes tust

```markdown
"Arbeite an diesem Task im Hintergrund:
[Detaillierte Beschreibung]

Ich mache währenddessen [andere Aufgabe].
Benachrichtige mich wenn fertig oder wenn du Fragen hast."
```

### Parallel Agents (14% essential)

```bash
# Terminal 1: Agent arbeitet an Feature A
claude "Implementiere UserProfile Feature"

# Terminal 2: Agent arbeitet an Feature B  
claude "Implementiere Settings Page"

# Voraussetzung: Getrennte Dateien, keine Konflikte
```

---

## Autonomy Levels

### Wann volle Autonomie geben

```bash
# Claude Code: YOLO Mode für einfache Tasks
claude --dangerously-skip-permissions

# Geeignet für:
# - Lint-Fixes über viele Dateien
# - Einfache Refactorings
# - Variable umbenennen
# - Import-Sortierung
```

### Wann Bestätigung verlangen

```markdown
"Für jede Datei-Änderung:
1. Zeige mir den geplanten Diff
2. Warte auf mein OK
3. Erst dann implementieren

Besonders wichtig bei:
- Datenbank-Migrationen
- Auth-bezogenem Code
- Produktions-Configs"
```

---

## Anti-Patterns

### ❌ Alles delegieren

```markdown
"Baue mir eine komplette E-Commerce App"
→ Zu vage, keine Kontrolle, schlechte Qualität
```

### ❌ Nichts delegieren

```markdown
Alles selbst tippen, AI nur für Autocomplete
→ Verschwendetes Potenzial
```

### ❌ Blind akzeptieren

```markdown
"Accept All" ohne Code zu lesen
→ Bugs und Security-Lücken
```

### ✅ Goldener Mittelweg

```markdown
1. Kritisches selbst schreiben
2. Repetitives delegieren
3. Alles reviewen
4. Iterativ verfeinern
```

---

## Checkliste

- [ ] Kritische Teile selbst geschrieben?
- [ ] Tedious Tasks an AI delegiert?
- [ ] Logging für AI-Debugging eingebaut?
- [ ] Bei Stuck: Pivot-Strategie angewandt?
- [ ] Code nach Delegation reviewt?
- [ ] Autonomy-Level passend gewählt?
