/**
 * Dismiss Popups Script
 *
 * Entfernt Cookie-Banner und Pop-ups vor Browser-Tests.
 * Ausfuehren via mcp__claude-in-chrome__javascript_tool
 *
 * @usage Vor jedem Test ausfuehren um sauberen Viewport zu erhalten
 * @version 1.0
 * @lastUpdated 2025-01-10
 */

(function dismissPopups() {
  const selectors = [
    // Cookie Consent Buttons (Accept/Akzeptieren)
    '[data-testid="cookie-accept"]',
    '[id*="cookie"] button[class*="accept"]',
    '[class*="cookie"] button[class*="accept"]',
    '[class*="consent"] button:first-child',
    '#onetrust-accept-btn-handler',
    '#onetrust-pc-btn-handler',
    '.cc-accept',
    '.cc-dismiss',
    '.cc-btn.cc-allow',
    '[aria-label*="Accept"]',
    '[aria-label*="Akzeptieren"]',
    '[aria-label*="Zustimmen"]',
    'button[class*="accept-all"]',
    'button[class*="acceptAll"]',
    'button[id*="accept"]',

    // DSGVO/GDPR specific
    '[class*="gdpr"] button[class*="accept"]',
    '[class*="dsgvo"] button[class*="accept"]',
    '[data-gdpr-accept]',

    // CMP (Consent Management Platforms)
    '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
    '.cmp-accept-all',
    '[class*="cmp"] button[class*="accept"]',

    // Generic Close Buttons
    '[class*="modal"] [class*="close"]',
    '[class*="popup"] [class*="close"]',
    '[class*="overlay"] [class*="close"]',
    '[class*="dialog"] [class*="close"]',
    '[aria-label="Close"]',
    '[aria-label="Schliessen"]',
    'button[class*="close-button"]',
    '[data-dismiss="modal"]',

    // Newsletter Popups
    '[class*="newsletter"] [class*="close"]',
    '[class*="subscribe"] [class*="close"]',
    '[class*="signup"] [class*="close"]',

    // Exit Intent / Promo Popups
    '[class*="exit-intent"] [class*="close"]',
    '[class*="promo"] [class*="close"]',
    '[class*="offer"] [class*="close"]'
  ];

  let dismissed = 0;
  const dismissedElements = [];

  // Click matching buttons
  selectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el.offsetParent !== null && el.offsetWidth > 0 && el.offsetHeight > 0) {
          el.click();
          dismissed++;
          dismissedElements.push({
            selector: selector,
            text: el.textContent?.trim().substring(0, 30) || '[no text]'
          });
        }
      });
    } catch (e) {
      // Selector might be invalid, continue
    }
  });

  // Remove fixed/sticky overlay elements
  const overlaySelectors = [
    '[class*="overlay"]:not(main):not(header):not(footer):not(nav)',
    '[class*="modal"]:not([style*="display: none"])',
    '[class*="popup"]:not([style*="display: none"])',
    '[class*="cookie-banner"]',
    '[class*="consent-banner"]',
    '[id*="cookie"]',
    '[id*="consent"]'
  ];

  overlaySelectors.forEach(selector => {
    try {
      const overlays = document.querySelectorAll(selector);
      overlays.forEach(el => {
        const style = getComputedStyle(el);
        if (style.position === 'fixed' || style.position === 'sticky') {
          const rect = el.getBoundingClientRect();
          // Only remove if it covers significant viewport area
          if (rect.width > window.innerWidth * 0.3 || rect.height > window.innerHeight * 0.2) {
            el.style.display = 'none';
            dismissed++;
            dismissedElements.push({
              selector: selector,
              action: 'hidden',
              size: `${Math.round(rect.width)}x${Math.round(rect.height)}`
            });
          }
        }
      });
    } catch (e) {
      // Continue
    }
  });

  // Remove backdrop/overlay blocking elements
  const backdrops = document.querySelectorAll(
    '[class*="backdrop"], [class*="overlay-bg"], [class*="modal-bg"]'
  );
  backdrops.forEach(el => {
    const style = getComputedStyle(el);
    if (style.position === 'fixed' && parseFloat(style.opacity) > 0) {
      el.style.display = 'none';
      dismissed++;
    }
  });

  // Re-enable scrolling if disabled
  if (document.body.style.overflow === 'hidden') {
    document.body.style.overflow = '';
    dismissed++;
    dismissedElements.push({ action: 'scroll-enabled' });
  }
  if (document.documentElement.style.overflow === 'hidden') {
    document.documentElement.style.overflow = '';
  }

  return {
    success: true,
    dismissed: dismissed,
    message: `Dismissed ${dismissed} popup(s)/overlay(s)`,
    details: dismissedElements.slice(0, 10) // Limit to first 10 for brevity
  };
})();
