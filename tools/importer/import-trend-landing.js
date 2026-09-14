/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroSplitParser from './parsers/hero-split.js';
import columnsArticleParser from './parsers/columns-article.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import cardsArticleParser from './parsers/cards-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
// Automatic structural section transformer (per-page section composition varies
// across the 3 trend-landing pages, so we derive breaks + styles from the DOM
// rather than a fixed template section list).
import sectionsTransformer from './transformers/wknd-trendsetters-sections-auto.js';

// PARSER REGISTRY
const parsers = {
  'hero-split': heroSplitParser,
  'columns-article': columnsArticleParser,
  'cards-feature': cardsFeatureParser,
  'cards-article': cardsArticleParser,
  'cards-gallery': cardsGalleryParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json (trend-landing)
const PAGE_TEMPLATE = {
  name: 'trend-landing',
  description: 'Trend/magazine landing page: split hero, trend-alert feature, feature-card showcase, image gallery, and closing accent CTA.',
  urls: [
    'https://wknd-trendsetters.site/fashion-trends-of-the-season',
    'https://wknd-trendsetters.site/fashion-trends-young-adults',
    'https://wknd-trendsetters.site/fashion-trends-young-adults-casual-sport',
  ],
  blocks: [
    { name: 'hero-split', instances: ['.secondary-section .grid-gap-xxl'] },
    { name: 'columns-article', instances: ['.grid-layout.grid-gap-lg:not(.desktop-3-column)'] },
    { name: 'cards-feature', instances: ['.grid-layout.desktop-3-column:not(.grid-gap-sm)'] },
    { name: 'cards-article', instances: ['.grid-layout.grid-gap-md'] },
    { name: 'cards-gallery', instances: ['.grid-layout.grid-gap-sm'] },
  ],
  sections: [
    {
      id: 'rc1', name: 'hero', selector: ['#main-content > header.section.secondary-section'],
      style: 'light-grey', blocks: ['hero-split'], defaultContent: [],
    },
    {
      id: 'rc-sec', name: 'secondary-section', selector: ['#main-content > section.section.secondary-section'],
      style: 'light-grey', blocks: [], defaultContent: [],
    },
    {
      id: 'rc-cta', name: 'closing-cta', selector: ['#main-content > section.section.accent-section'],
      style: 'accent', blocks: [], defaultContent: ['.container'],
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, sections after
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

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

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
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

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

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
