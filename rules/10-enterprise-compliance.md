# Enterprise Compliance & Regulatorik

- Last Updated: 2025-01-09
- Description: Verbindliche Vorgaben für GDPR, Accessibility, Internationalisierung und branchenspezifische Anforderungen
- Version: 1.0

## Kernprinzip

Rechtliche und regionale Anforderungen werden **vor** der Implementierung definiert und in **jeder** Anfrage explizit referenziert.

---

## GDPR / Datenschutz

### Pflicht-Elemente für EU-Märkte

```markdown
Jedes Formular mit personenbezogenen Daten MUSS enthalten:

1. **Consent-Checkbox** (nicht vorausgewählt)
   - Text: "Ich stimme der Verarbeitung meiner Daten zu"
   - Link zur Datenschutzerklärung
   
2. **Datenspeicher-Hinweis**
   - Wo werden Daten gespeichert?
   - Wie lange?
   - Wer hat Zugriff?

3. **Opt-out Möglichkeit**
   - "Ich möchte keine Marketing-E-Mails erhalten"
   - Separates Opt-in für Newsletter
```

### AI-Anfrage für GDPR-konformes Formular

```markdown
Erstelle ein Kontaktformular (GDPR-konform für EU):

**Felder:**
- Name, E-Mail, Nachricht

**Pflicht-Elemente:**
- Consent-Checkbox mit Link zu /datenschutz
- Hinweis: "Daten werden auf EU-Servern gespeichert"
- Hinweis: "Löschung auf Anfrage möglich"

**Opt-ins (optional, unchecked):**
- Newsletter-Subscription
- Produktupdates

**Validierung:**
- Consent MUSS checked sein vor Submit
```

---

## Accessibility (WCAG 2.1 AA)

### Mindest-Anforderungen

```markdown
Jede Komponente MUSS erfüllen:

1. **Farbkontrast**: min. 4.5:1 für Text
2. **Keyboard-Navigation**: alle Interaktionen ohne Maus
3. **Screen-Reader**: sinnvolle ARIA-Labels
4. **Focus-Indikatoren**: sichtbar bei Keyboard-Nav
5. **Touch-Targets**: min. 44x44px auf Mobile
```

### AI-Anfrage mit Accessibility

```markdown
Erstelle Button-Komponente (WCAG 2.1 AA):

**Anforderungen:**
- Farbkontrast prüfen (4.5:1 minimum)
- `aria-label` wenn nur Icon
- `aria-busy="true"` während Loading
- `aria-disabled="true"` wenn disabled
- Fokus-Ring: `focus-visible:ring-2`
- Touch-Target: min-h-[44px] min-w-[44px]
```

### Accessibility-Checkliste

```markdown
## A11y Prüfung vor Release

- [ ] Lighthouse Accessibility Score > 95
- [ ] Keyboard-only Navigation getestet
- [ ] Screen-Reader getestet (VoiceOver/NVDA)
- [ ] Farbkontrast mit WebAIM Checker
- [ ] Keine autoplaying Media
- [ ] Formulare haben Labels
- [ ] Bilder haben alt-Text
- [ ] Skip-Links vorhanden
```

---

## Internationalisierung (i18n)

### Grundstruktur

```markdown
Alle UI-Texte MÜSSEN i18n-fähig sein:

❌ <span>Willkommen</span>
✅ <span>{{ $t('welcome') }}</span>

❌ <span>3 items</span>  
✅ <span>{{ $tc('items', count) }}</span>
```

### Lokalisierungs-Anforderungen

```markdown
**Sprachen:** DE, EN, FR (weitere später)

**Formate:**
- Datum: DE="DD.MM.YYYY", EN="MM/DD/YYYY"
- Währung: DE="1.234,56 €", EN="$1,234.56"
- Zahlen: DE="1.234,56", EN="1,234.56"

**Pluralisierung:**
- 0 items, 1 item, 2 items
- 0 Artikel, 1 Artikel, 2 Artikel
```

### AI-Anfrage mit i18n

```markdown
Erstelle ProductCard mit i18n-Support:

**Texte (alle über $t()):**
- Titel: product.title
- Preis: formatCurrency(price, locale)
- Status: product.status.[available|outOfStock]
- Button: actions.addToCart

**Locale-sensitive:**
- Datum: formatDate(date, locale)
- Zahl: formatNumber(quantity, locale)
```

---

## Branchen-spezifische Compliance

### Fintech / Banking

```markdown
**PCI-DSS Anforderungen:**
- Keine Kreditkartendaten in Logs
- Verschlüsselung für sensible Daten
- Session-Timeout nach 15 Min Inaktivität

**Audit-Trail:**
- Alle Transaktionen loggen
- User, Timestamp, Action, IP
```

### Healthcare

```markdown
**HIPAA Anforderungen:**
- PHI nur verschlüsselt speichern
- Zugriffskontrolle dokumentieren
- Break-Glass Procedure für Notfälle
```

### E-Commerce

```markdown
**Verbraucherschutz:**
- Widerrufsrecht (14 Tage EU)
- Preise inkl. MwSt für B2C
- Lieferzeiten-Angabe
- Impressum und AGB verlinkt
```

---

## Dokumentation in DECISIONS.md

```markdown
# ADR-005: GDPR-Implementierung

## Status
Akzeptiert (2025-01-09)

## Kontext
EU-Markt erfordert GDPR-Compliance.

## Entscheidung
- Alle Formulare mit Consent-Checkbox
- Cookie-Banner mit Opt-in
- Datenexport-Funktion für User

## Konsequenzen
- Zusätzlicher Entwicklungsaufwand
- Consent-State in jedem Form-Submit
```

---

## Checkliste für AI-Anfragen

- [ ] Regulatorische Region genannt (EU/US/etc.)?
- [ ] GDPR-Anforderungen spezifiziert?
- [ ] Accessibility-Level genannt (WCAG AA)?
- [ ] i18n-Sprachen definiert?
- [ ] Branchenspezifische Compliance?
- [ ] Dokumentation in DECISIONS.md verlangt?
