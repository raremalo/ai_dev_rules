/**
 * Extract Selectors Script
 *
 * Extrahiert Schluessel-Elemente als Selektoren statt vollstaendigem DOM.
 * Reduziert Token-Verbrauch erheblich (~2.000 statt 50.000+ Zeichen).
 *
 * @usage Statt read_page bei grossen Seiten verwenden
 * @version 1.0
 * @lastUpdated 2025-01-10
 */

(function extractSelectors() {
  const result = {
    meta: {},
    navigation: [],
    headings: [],
    buttons: [],
    links: [],
    forms: [],
    images: [],
    sections: [],
    summary: {}
  };

  // Meta-Informationen (SEO-relevant)
  result.meta = {
    title: document.title,
    titleLength: document.title.length,
    description: document.querySelector('meta[name="description"]')?.content || null,
    descriptionLength: document.querySelector('meta[name="description"]')?.content?.length || 0,
    canonical: document.querySelector('link[rel="canonical"]')?.href || null,
    lang: document.documentElement.lang || null,
    viewport: document.querySelector('meta[name="viewport"]')?.content || null,
    robots: document.querySelector('meta[name="robots"]')?.content || null,
    ogTitle: document.querySelector('meta[property="og:title"]')?.content || null,
    ogDescription: document.querySelector('meta[property="og:description"]')?.content || null,
    ogImage: document.querySelector('meta[property="og:image"]')?.content || null
  };

  // Navigation Links
  const navElements = document.querySelectorAll('nav a, header a, [role="navigation"] a');
  navElements.forEach((a, i) => {
    if (i < 20) { // Limit to 20
      const text = a.textContent?.trim().substring(0, 50);
      if (text) {
        result.navigation.push({
          text: text,
          href: a.href,
          selector: a.id ? `#${a.id}` : a.getAttribute('data-testid') ? `[data-testid="${a.getAttribute('data-testid')}"]` : null
        });
      }
    }
  });

  // Headings (H1-H3)
  ['h1', 'h2', 'h3'].forEach(tag => {
    document.querySelectorAll(tag).forEach((h, i) => {
      if (result.headings.length < 30) { // Limit total
        result.headings.push({
          level: tag.toUpperCase(),
          text: h.textContent?.trim().substring(0, 100),
          selector: h.id ? `#${h.id}` : `${tag}:nth-of-type(${i + 1})`
        });
      }
    });
  });

  // Buttons und CTAs
  const buttonSelectors = 'button, [role="button"], a[class*="btn"], a[class*="cta"], a[class*="button"], input[type="submit"]';
  document.querySelectorAll(buttonSelectors).forEach((btn, i) => {
    if (i < 20) { // Limit
      const text = btn.textContent?.trim().substring(0, 50) || btn.value || btn.getAttribute('aria-label');
      if (text) {
        result.buttons.push({
          text: text,
          type: btn.tagName.toLowerCase(),
          selector: btn.id ? `#${btn.id}` : btn.getAttribute('data-testid') ? `[data-testid="${btn.getAttribute('data-testid')}"]` : null,
          href: btn.href || null
        });
      }
    }
  });

  // Wichtige Links (nicht in Nav)
  const mainLinks = document.querySelectorAll('main a, article a, section a, footer a');
  const seenHrefs = new Set(result.navigation.map(n => n.href));
  mainLinks.forEach((a, i) => {
    if (result.links.length < 15 && !seenHrefs.has(a.href)) {
      const text = a.textContent?.trim().substring(0, 50);
      if (text && a.href) {
        result.links.push({
          text: text,
          href: a.href,
          isExternal: a.hostname !== window.location.hostname
        });
        seenHrefs.add(a.href);
      }
    }
  });

  // Forms
  document.querySelectorAll('form').forEach((form, i) => {
    if (i < 5) { // Limit
      const inputs = form.querySelectorAll('input:not([type="hidden"]), textarea, select');
      const inputTypes = [];
      inputs.forEach(input => {
        inputTypes.push(input.type || input.tagName.toLowerCase());
      });

      result.forms.push({
        action: form.action || 'none',
        method: form.method || 'get',
        inputCount: inputs.length,
        inputTypes: [...new Set(inputTypes)],
        selector: form.id ? `#${form.id}` : `form:nth-of-type(${i + 1})`,
        hasSubmit: !!form.querySelector('button[type="submit"], input[type="submit"]')
      });
    }
  });

  // Images (erste 15)
  document.querySelectorAll('img').forEach((img, i) => {
    if (i < 15) {
      result.images.push({
        alt: img.alt || null,
        hasAlt: !!img.alt,
        src: img.src?.substring(0, 80),
        isLazy: img.loading === 'lazy',
        selector: img.id ? `#${img.id}` : img.getAttribute('data-testid') ? `[data-testid="${img.getAttribute('data-testid')}"]` : null
      });
    }
  });

  // Page Sections
  const sectionElements = document.querySelectorAll('header, main, footer, section, article, aside, [role="banner"], [role="main"], [role="contentinfo"]');
  sectionElements.forEach((el, i) => {
    if (i < 10) {
      const rect = el.getBoundingClientRect();
      result.sections.push({
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute('role') || null,
        id: el.id || null,
        className: el.className?.split(' ').slice(0, 3).join(' ') || null,
        height: Math.round(rect.height),
        visible: rect.height > 0
      });
    }
  });

  // Summary Statistics
  result.summary = {
    h1Count: document.querySelectorAll('h1').length,
    h2Count: document.querySelectorAll('h2').length,
    linkCount: document.querySelectorAll('a').length,
    imageCount: document.querySelectorAll('img').length,
    imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length,
    formCount: document.querySelectorAll('form').length,
    buttonCount: document.querySelectorAll('button, [role="button"]').length,
    hasHeader: !!document.querySelector('header'),
    hasMain: !!document.querySelector('main'),
    hasFooter: !!document.querySelector('footer'),
    hasNav: !!document.querySelector('nav'),
    pageHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
  };

  return result;
})();
