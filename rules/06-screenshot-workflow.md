# Screenshot-Driven Development

- Last Updated: 2025-01-09
- Description: Methodik zur visuellen Kommunikation von UI-Anforderungen mittels annotierter Screenshots
- Version: 1.0

## Kernprinzip

Ein annotierter Screenshot kommuniziert mehr als 100 Wörter Text. Nutze visuelle Referenzen für präzise UI-Anforderungen.

---

## Screenshot-Typen

### 1. Änderungs-Screenshot
Bestehende UI mit eingezeichneten Änderungen:

```
[Screenshot mit Annotationen]
├── Pfeil 1: "Button hier platzieren, primär-blau"
├── Pfeil 2: "Padding erhöhen auf 24px"
├── Rahmen: "Dieser Bereich in Card-Container"
└── Durchgestrichen: "Element entfernen"
```

### 2. Referenz-Screenshot
Inspiration von anderen UIs:

```
[Screenshot von Referenz-UI]
├── Markierung: "Diesen Card-Style übernehmen"
├── Farbpipette: "Exakt diese Grautöne"
└── Notiz: "Animation beim Hover wie hier"
```

### 3. State-Screenshot
Verschiedene Zustände visualisieren:

```
[Collage von 4 States]
├── Default: Normaler Zustand
├── Hover: Erhöhter Shadow
├── Loading: Skeleton-Placeholder
└── Error: Roter Border, Error-Message
```

---

## Annotations-Toolkit

### Empfohlene Tools
- **macOS**: Screenshot + Preview (kostenlos)
- **Cross-Platform**: Cleanshot X, Snagit, Shottr
- **Browser**: Browser-Screenshot + Figma/Excalidraw

### Annotations-Elemente

| Element | Verwendung | Beispiel |
|---------|------------|----------|
| Pfeil | Zeigt auf spezifisches Element | → "Button hier" |
| Rahmen | Gruppiert zusammengehörige Elemente | ▭ "Diese Section" |
| Nummer | Reihenfolge/Priorität | ① ② ③ |
| Durchstreichen | Zu entfernen | ~~Alt~~ |
| Farbkreis | Farbangabe | 🔵 #0ea5e9 |
| Text-Label | Spezifikation | "16px, bold" |

---

## AI-Anfrage mit Screenshot

```markdown
[Screenshot hochladen]

Setze folgende Änderungen um:

1. **Pfeil A**: Neuer Button "Export", 
   - Position: rechts neben "Filter"
   - Variant: secondary
   - Icon: Download (Lucide)

2. **Rahmen B**: Card-Container hinzufügen
   - Shadow: sm
   - Padding: 16px
   - Border-Radius: 8px

3. **Durchgestrichen C**: Dieses Dropdown entfernen

4. **Farbkreis D**: Background ändern zu #f3f4f6
```

---

## State-Dokumentation

Für jede interaktive Komponente, Screenshots aller States:

```markdown
## Button States

| State | Screenshot | Beschreibung |
|-------|------------|--------------|
| Default | [img] | Primär-Blau, Text weiß |
| Hover | [img] | Hellerer Hintergrund |
| Active | [img] | Dunklerer Hintergrund |
| Disabled | [img] | Grau, 50% Opacity |
| Loading | [img] | Spinner statt Text |
```

---

## Checkliste

- [ ] Screenshot ist scharf und aktuell?
- [ ] Annotationen sind lesbar (nicht zu klein)?
- [ ] Farben als Hex angegeben?
- [ ] Abstände in px/rem spezifiziert?
- [ ] Alle betroffenen States gezeigt?
- [ ] Responsive-Varianten berücksichtigt?
