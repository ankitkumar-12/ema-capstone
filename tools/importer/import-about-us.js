/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroSplitParser from './parsers/hero-split.js';
import columnsArticleParser from './parsers/columns-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroOverlayParser from './parsers/hero-overlay.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-split': heroSplitParser,
  'columns-article': columnsArticleParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-overlay': heroOverlayParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'about-us',
  description: 'About-us / case-study page: split hero, article intro, image gallery, testimonial tabs, article cards, FAQ, and a closing overlay CTA.',
  urls: [
    'https://wknd-trendsetters.site/about-us',
  ],
  blocks: [
    {
      name: 'hero-split',
      instances: ['.secondary-section .grid-gap-xxl'],
    },
    {
      name: 'columns-article',
      instances: ['.section:not(.secondary-section) .grid-gap-lg'],
    },
    {
      name: 'cards-gallery',
      instances: ['.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-sm'],
    },
    {
      name: 'tabs-testimonial',
      instances: ['.tabs-wrapper'],
    },
    {
      name: 'cards-article',
      instances: ['.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-md'],
    },
    {
      name: 'accordion-faq',
      instances: ['.faq-list'],
    },
    {
      name: 'hero-overlay',
      instances: ['.inverse-section .utility-position-relative'],
    },
  ],
  sections: [
    {
      id: 'rc1', name: 'hero', selector: ['#main-content > header.section.secondary-section'],
      style: 'light-grey', blocks: ['hero-split'], defaultContent: [],
    },
    {
      id: 'rc2', name: 'article-intro', selector: ['#main-content > section.section:nth-of-type(1)'],
      style: null, blocks: ['columns-article'], defaultContent: [],
    },
    {
      id: 'rc3', name: 'gallery', selector: ['#main-content > section.section.secondary-section:nth-of-type(2)'],
      style: 'light-grey', blocks: ['cards-gallery'], defaultContent: ['.utility-text-align-center'],
    },
    {
      id: 'rc4', name: 'testimonials', selector: ['#main-content > section.section:nth-of-type(3)'],
      style: null, blocks: ['tabs-testimonial'], defaultContent: [],
    },
    {
      id: 'rc5', name: 'latest-articles', selector: ['#main-content > section.section.secondary-section:nth-of-type(4)'],
      style: 'light-grey', blocks: ['cards-article'], defaultContent: ['.utility-text-align-center'],
    },
    {
      id: 'rc6', name: 'faq', selector: ['#main-content > section.section:nth-of-type(5)'],
      style: null, blocks: ['accordion-faq'], defaultContent: ['.grid-gap-xxl > div:first-child'],
    },
    {
      id: 'rc7', name: 'closing-cta', selector: ['#main-content > section.section.inverse-section'],
      style: 'dark', blocks: ['hero-overlay'], defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, sections after (afterTransform adds <hr> breaks)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip elements already replaced by a prior parser)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform cleanup + section breaks/metadata
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
