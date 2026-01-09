# Context Management & Token-Effizienz

- Last Updated: 2025-01-09
- Description: Strategien zur optimalen Nutzung des AI-Kontextfensters und Erhaltung der Antwortqualität
- Version: 1.0

## Kernprinzip

AI-Agents haben ein begrenztes Kontextfenster. Lange Chats akkumulieren irrelevanten Kontext und reduzieren Qualität + Geschwindigkeit.

---

## Wann neuen Chat starten?

### Sofort neuen Chat bei:

| Trigger | Grund |
|---------|-------|
| Feature abgeschlossen | Sauberer Start für nächstes |
| Nach 15-20 Nachrichten | Kontext wird unübersichtlich |
| Themen-Wechsel | Alter Kontext irrelevant |
| Nach Debug-Session | Debug-Noise entfernen |
| Agent macht Fehler | Frischer Kontext hilft |
| Performance-Verlangsamung | Zu viel Token-Load |

### Im aktuellen Chat bleiben bei:

| Situation | Grund |
|-----------|-------|
| Iteration an gleicher Komponente | Kontext relevant |
| Zusammenhängende Changes | Zusammenhang wichtig |
| Schrittweise Refactoring | Muss kohärent bleiben |

---

## Chat-Hygiene Befehle

### Cursor
```
/clear     # Chat leeren
/reset     # Kompletter Reset
Cmd+K      # Neuer Inline-Chat
```

### Claude.ai
```
Neuer Chat via Sidebar
Strg+Shift+O für neuen Chat
```

### Claude Code (CLI)
```bash
/clear     # Kontext leeren
/compact   # Komprimiere History
exit + neu starten
```

---

## Kontext-Transfer Protokoll

Beim Wechsel zu neuem Chat:

```markdown
## Kontext-Übergabe

**Projekt:** E-Commerce Dashboard  
**Letzter Stand:** UserCard implementiert, funktioniert

**Relevante Dateien:**
- `components/UserCard.vue` - fertig
- `stores/user.ts` - fertig  
- `pages/dashboard.vue` - in Arbeit

**Aktueller Task:**
Dashboard-Seite mit UserCard-Integration

**Bekannte Patterns:**
- Loading via `isLoading` Prop + Skeleton
- Errors via Toast-Composable

**Offene Punkte:**
- Pagination für User-Liste
```

---

## Token-Spar-Strategien

### 1. Referenzieren statt Kopieren
```markdown
❌ [Kompletter Code von Button.vue hier einfügen]

✅ "Wie in Button.vue (lies die Datei), 
    implementiere dasselbe Varianten-Pattern"
```

### 2. Inkrementelle Anfragen
```markdown
❌ "Baue komplettes Dashboard mit Header, 
    Sidebar, Stats, Charts und Table"

✅ "Implementiere DashboardHeader"
   [Fertig]
   "Jetzt DashboardStats"
   [Fertig]
   "Jetzt DashboardTable"
```

### 3. Zusammenfassungen statt History
```markdown
❌ [20 Nachrichten Debug-Geschichte]

✅ "Zusammenfassung: Wir haben den Auth-Bug 
    durch Hinzufügen von Token-Refresh gelöst.
    Jetzt implementiere..."
```

---

## Context Window Management

### Optimale Chat-Länge
```
Nachrichten: 10-15 ideal, max 25
Code-Zeilen im Kontext: ~500-1000
Dateien referenziert: 3-5 pro Anfrage
```

### Priorität im Kontext

```
1. Aktuelle Anfrage (immer)
2. Direkt relevante Code-Dateien
3. Type-Definitionen
4. Pattern-Beispiele
5. Dokumentation (nur wenn nötig)
```

### Was NICHT im Kontext

```
- Komplette node_modules
- Generierte Dateien (dist, build)
- Lock-Files
- Große Datenfiles
- Irrelevante Komponenten
```

---

## Session-Dokumentation

Am Ende jeder Session in MILESTONES.md:

```markdown
## Session 2025-01-09

### Implementiert
- [x] UserCard Komponente
- [x] UserList mit Pagination
- [x] Search-Filter

### Nächste Session
- [ ] UserDetail Modal
- [ ] Edit-Formular

### Bekannte Issues
- Performance bei >100 Users (lazy loading nötig)

### Patterns etabliert
- Skeleton-Loading für alle Listen
- Toast für Error-Handling
```

---

## Checkliste

- [ ] Chat nach Feature-Abschluss gewechselt?
- [ ] Kontext-Übergabe dokumentiert?
- [ ] Nur relevante Dateien referenziert?
- [ ] Code zusammengefasst statt kopiert?
- [ ] Session-Ergebnis in MILESTONES.md?
- [ ] Offene Punkte notiert?
