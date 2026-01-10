/**
 * Page Metrics Script
 *
 * Sammelt Performance-, Accessibility- und SEO-Metriken.
 * Token-effiziente Alternative zu vollstaendiger DOM-Analyse.
 *
 * @usage Nach Seitenladung ausfuehren fuer umfassende Metriken
 * @version 1.0
 * @lastUpdated 2025-01-10
 */

(function collectPageMetrics() {
  const metrics = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    performance: {},
    seo: {},
    accessibility: {},
    structure: {},
    resources: {},
    summary: {}
  };

  // ============================================
  // PERFORMANCE METRICS
  // ============================================
  if (window.performance) {
    const timing = performance.timing;
    const navigation = performance.getEntriesByType('navigation')[0];

    // Core Web Vitals (where available)
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(e => e.name === 'first-paint');
    const firstContentfulPaint = paintEntries.find(e => e.name === 'first-contentful-paint');

    metrics.performance = {
      // Navigation Timing
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      loadComplete: timing.loadEventEnd - timing.navigationStart,
      domInteractive: timing.domInteractive - timing.navigationStart,

      // Paint Timing
      firstPaint: firstPaint?.startTime || null,
      firstContentfulPaint: firstContentfulPaint?.startTime || null,

      // Resource Counts
      resourceCount: performance.getEntriesByType('resource').length,

      // Memory (if available)
      jsHeapSize: performance.memory?.usedJSHeapSize || null,

      // Status
      status: timing.loadEventEnd > 0 ? 'loaded' : 'loading'
    };

    // Resource breakdown
    const resources = performance.getEntriesByType('resource');
    const resourceTypes = {};
    resources.forEach(r => {
      const type = r.initiatorType || 'other';
      if (!resourceTypes[type]) {
        resourceTypes[type] = { count: 0, totalSize: 0, totalDuration: 0 };
      }
      resourceTypes[type].count++;
      resourceTypes[type].totalDuration += r.duration;
    });
    metrics.resources = resourceTypes;
  }

  // ============================================
  // SEO METRICS
  // ============================================
  const title = document.title;
  const metaDescription = document.querySelector('meta[name="description"]');
  const canonical = document.querySelector('link[rel="canonical"]');
  const robots = document.querySelector('meta[name="robots"]');

  // Open Graph
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  const ogType = document.querySelector('meta[property="og:type"]');

  // Twitter Cards
  const twitterCard = document.querySelector('meta[name="twitter:card"]');
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');

  // Structured Data
  const jsonLd = document.querySelectorAll('script[type="application/ld+json"]');

  metrics.seo = {
    // Title
    title: {
      value: title,
      length: title.length,
      optimal: title.length >= 50 && title.length <= 60,
      status: title.length < 30 ? 'too_short' : title.length > 60 ? 'too_long' : 'ok'
    },

    // Description
    description: {
      value: metaDescription?.content || null,
      length: metaDescription?.content?.length || 0,
      optimal: metaDescription?.content?.length >= 150 && metaDescription?.content?.length <= 160,
      status: !metaDescription ? 'missing' :
              metaDescription.content.length < 120 ? 'too_short' :
              metaDescription.content.length > 160 ? 'too_long' : 'ok'
    },

    // Headings
    h1: {
      count: document.querySelectorAll('h1').length,
      optimal: document.querySelectorAll('h1').length === 1,
      values: [...document.querySelectorAll('h1')].map(h => h.textContent.trim().substring(0, 80))
    },
    h2Count: document.querySelectorAll('h2').length,
    h3Count: document.querySelectorAll('h3').length,

    // Technical SEO
    canonical: canonical?.href || null,
    robots: robots?.content || null,

    // Open Graph
    openGraph: {
      hasTitle: !!ogTitle,
      hasDescription: !!ogDescription,
      hasImage: !!ogImage,
      hasUrl: !!ogUrl,
      hasType: !!ogType,
      complete: !!(ogTitle && ogDescription && ogImage)
    },

    // Twitter Cards
    twitterCards: {
      hasCard: !!twitterCard,
      hasTitle: !!twitterTitle
    },

    // Structured Data
    structuredData: {
      count: jsonLd.length,
      hasJsonLd: jsonLd.length > 0
    }
  };

  // ============================================
  // ACCESSIBILITY METRICS
  // ============================================
  const images = document.querySelectorAll('img');
  const imagesWithoutAlt = [...images].filter(img => !img.alt && !img.getAttribute('role'));

  const links = document.querySelectorAll('a');
  const linksWithoutText = [...links].filter(a =>
    !a.textContent.trim() &&
    !a.getAttribute('aria-label') &&
    !a.querySelector('img[alt]')
  );

  const formInputs = document.querySelectorAll('input:not([type="hidden"]), textarea, select');
  const inputsWithoutLabels = [...formInputs].filter(input => {
    const id = input.id;
    const hasLabel = id && document.querySelector(`label[for="${id}"]`);
    const hasAriaLabel = input.getAttribute('aria-label');
    const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
    const hasPlaceholder = input.placeholder;
    return !hasLabel && !hasAriaLabel && !hasAriaLabelledBy && !hasPlaceholder;
  });

  const skipLinks = document.querySelectorAll('a[href="#main"], a[href="#content"], a[href="#maincontent"], [class*="skip"]');

  metrics.accessibility = {
    // Language
    lang: {
      value: document.documentElement.lang || null,
      hasLang: !!document.documentElement.lang,
      status: document.documentElement.lang ? 'ok' : 'missing'
    },

    // Skip Link
    skipLink: {
      found: skipLinks.length > 0,
      count: skipLinks.length
    },

    // Images
    images: {
      total: images.length,
      withoutAlt: imagesWithoutAlt.length,
      percentage: images.length > 0 ? Math.round((images.length - imagesWithoutAlt.length) / images.length * 100) : 100,
      status: imagesWithoutAlt.length === 0 ? 'ok' : imagesWithoutAlt.length <= 2 ? 'warning' : 'error',
      missingAlt: imagesWithoutAlt.slice(0, 5).map(img => ({
        src: img.src?.substring(0, 60),
        selector: img.id ? `#${img.id}` : null
      }))
    },

    // Links
    links: {
      total: links.length,
      withoutText: linksWithoutText.length,
      status: linksWithoutText.length === 0 ? 'ok' : 'warning'
    },

    // Forms
    forms: {
      inputCount: formInputs.length,
      withoutLabels: inputsWithoutLabels.length,
      percentage: formInputs.length > 0 ? Math.round((formInputs.length - inputsWithoutLabels.length) / formInputs.length * 100) : 100,
      status: inputsWithoutLabels.length === 0 ? 'ok' : 'warning'
    },

    // ARIA
    ariaLandmarks: {
      banner: !!document.querySelector('[role="banner"], header'),
      navigation: !!document.querySelector('[role="navigation"], nav'),
      main: !!document.querySelector('[role="main"], main'),
      contentinfo: !!document.querySelector('[role="contentinfo"], footer')
    }
  };

  // ============================================
  // STRUCTURE METRICS
  // ============================================
  metrics.structure = {
    // Semantic HTML
    hasDoctype: document.doctype !== null,
    hasHeader: !!document.querySelector('header'),
    hasMain: !!document.querySelector('main'),
    hasFooter: !!document.querySelector('footer'),
    hasNav: !!document.querySelector('nav'),
    hasAside: !!document.querySelector('aside'),

    // Sections
    sectionCount: document.querySelectorAll('section').length,
    articleCount: document.querySelectorAll('article').length,

    // Page Dimensions
    pageWidth: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
    pageHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,

    // Forms
    formCount: document.querySelectorAll('form').length,

    // Media
    videoCount: document.querySelectorAll('video').length,
    audioCount: document.querySelectorAll('audio').length,
    iframeCount: document.querySelectorAll('iframe').length
  };

  // ============================================
  // SUMMARY / SCORES
  // ============================================

  // SEO Score (0-100)
  let seoScore = 0;
  if (metrics.seo.title.status === 'ok') seoScore += 20;
  else if (metrics.seo.title.value) seoScore += 10;
  if (metrics.seo.description.status === 'ok') seoScore += 20;
  else if (metrics.seo.description.value) seoScore += 10;
  if (metrics.seo.h1.optimal) seoScore += 20;
  if (metrics.seo.canonical) seoScore += 15;
  if (metrics.seo.openGraph.complete) seoScore += 15;
  if (metrics.seo.structuredData.hasJsonLd) seoScore += 10;

  // Accessibility Score (0-100)
  let a11yScore = 0;
  if (metrics.accessibility.lang.hasLang) a11yScore += 20;
  if (metrics.accessibility.skipLink.found) a11yScore += 15;
  if (metrics.accessibility.images.status === 'ok') a11yScore += 25;
  else if (metrics.accessibility.images.status === 'warning') a11yScore += 15;
  if (metrics.accessibility.forms.status === 'ok') a11yScore += 20;
  if (metrics.accessibility.ariaLandmarks.main) a11yScore += 10;
  if (metrics.accessibility.ariaLandmarks.navigation) a11yScore += 10;

  metrics.summary = {
    seoScore: seoScore,
    accessibilityScore: a11yScore,
    performanceLoaded: metrics.performance.status === 'loaded',
    loadTime: metrics.performance.loadComplete,

    // Quick Status
    issues: {
      critical: [],
      warnings: [],
      info: []
    }
  };

  // Identify issues
  if (metrics.seo.h1.count !== 1) {
    metrics.summary.issues.critical.push(`H1: ${metrics.seo.h1.count} gefunden (erwartet: 1)`);
  }
  if (!metrics.seo.description.value) {
    metrics.summary.issues.critical.push('Meta-Description fehlt');
  }
  if (!metrics.accessibility.lang.hasLang) {
    metrics.summary.issues.warnings.push('Lang-Attribut fehlt');
  }
  if (metrics.accessibility.images.withoutAlt > 0) {
    metrics.summary.issues.warnings.push(`${metrics.accessibility.images.withoutAlt} Bild(er) ohne Alt-Text`);
  }
  if (!metrics.accessibility.skipLink.found) {
    metrics.summary.issues.info.push('Skip-Link nicht gefunden');
  }
  if (metrics.seo.description.status === 'too_short') {
    metrics.summary.issues.info.push('Meta-Description koennte laenger sein');
  }

  return metrics;
})();
