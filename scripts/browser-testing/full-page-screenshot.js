/**
 * Full Page Screenshot Preparation Script
 *
 * Bereitet Full-Page Screenshots vor und gibt Dimensionen/Positionen zurueck.
 * Token-sparend: Statt mehrerer Viewport-Screenshots nur gezielte Sections.
 *
 * @usage Vor Screenshot-Sequenz ausfuehren
 * @version 1.0
 * @lastUpdated 2025-01-10
 */

(function prepareFullPageScreenshot() {
  // Scroll to top
  window.scrollTo(0, 0);

  // Get full page dimensions
  const body = document.body;
  const html = document.documentElement;

  const fullHeight = Math.max(
    body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight
  );

  const fullWidth = Math.max(
    body.scrollWidth, body.offsetWidth,
    html.clientWidth, html.scrollWidth, html.offsetWidth
  );

  // Viewport dimensions
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // Calculate screenshots needed for full page
  const screenshotsNeeded = Math.ceil(fullHeight / viewportHeight);

  // Key sections with positions (fuer gezielte Screenshots)
  const keySelectors = [
    'header',
    '[class*="hero"]',
    '[class*="banner"]',
    'main',
    '[class*="features"]',
    '[class*="services"]',
    '[class*="about"]',
    '[class*="testimonial"]',
    '[class*="pricing"]',
    '[class*="contact"]',
    '[class*="cta"]',
    'footer'
  ];

  const sections = [];

  keySelectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.height > 50) { // Only meaningful sections
          sections.push({
            name: selector.replace(/[\[\]*="]/g, ''),
            selector: el.id ? `#${el.id}` : `${selector}${elements.length > 1 ? `:nth-of-type(${index + 1})` : ''}`,
            top: Math.round(rect.top + window.scrollY),
            height: Math.round(rect.height),
            visible: rect.height > 0 && rect.width > 0,
            scrollY: Math.round(rect.top + window.scrollY - 50) // Position to scroll to (with 50px buffer)
          });
        }
      });
    } catch (e) {
      // Invalid selector, skip
    }
  });

  // Sort sections by position
  sections.sort((a, b) => a.top - b.top);

  // Remove duplicates (same scroll position)
  const uniqueSections = sections.filter((section, index, self) =>
    index === self.findIndex(s => Math.abs(s.scrollY - section.scrollY) < 100)
  );

  // Calculate scroll positions for full-page capture
  const scrollPositions = [];
  for (let i = 0; i < screenshotsNeeded; i++) {
    scrollPositions.push({
      index: i,
      scrollY: i * viewportHeight,
      label: `segment_${i + 1}_of_${screenshotsNeeded}`
    });
  }

  // Token-efficient strategy: Key sections only
  const efficientStrategy = {
    recommended: uniqueSections.slice(0, 6), // Max 6 key sections
    screenshotsNeeded: Math.min(uniqueSections.length, 6),
    estimatedTokens: Math.min(uniqueSections.length, 6) * 1500 // ~1500 tokens per screenshot
  };

  // Full-page strategy (mehr Screenshots, mehr Tokens)
  const fullStrategy = {
    scrollPositions: scrollPositions,
    screenshotsNeeded: screenshotsNeeded,
    estimatedTokens: screenshotsNeeded * 1500
  };

  return {
    page: {
      fullWidth: fullWidth,
      fullHeight: fullHeight,
      viewportWidth: viewportWidth,
      viewportHeight: viewportHeight
    },

    // Empfehlung: Nutze efficientStrategy fuer Token-Effizienz
    efficientStrategy: efficientStrategy,

    // Alternative: Nutze fullStrategy fuer komplette Abdeckung
    fullStrategy: fullStrategy,

    // Alle gefundenen Sections
    allSections: uniqueSections,

    // Scrolle zu Section mit:
    // window.scrollTo(0, section.scrollY)

    // Screenshot-Workflow:
    workflow: [
      '1. Fuer jeden Section in efficientStrategy.recommended:',
      '   a. window.scrollTo(0, section.scrollY)',
      '   b. await new Promise(r => setTimeout(r, 500)) // Warten',
      '   c. Screenshot erstellen',
      '2. Oder: Nutze fullStrategy.scrollPositions fuer komplette Seite'
    ]
  };
})();
