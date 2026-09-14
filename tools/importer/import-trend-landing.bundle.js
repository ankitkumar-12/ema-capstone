/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-trend-landing.js
  var import_trend_landing_exports = {};
  __export(import_trend_landing_exports, {
    default: () => import_trend_landing_default
  });

  // tools/importer/parsers/hero-split.js
  function parse(element, { document: document2 }) {
    const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
    const subheading = element.querySelector("p.subheading, .subheading, p");
    const buttonGroup = element.querySelector(".button-group");
    const ctaLinks = buttonGroup ? [buttonGroup] : Array.from(element.querySelectorAll("a.button, a.cta"));
    const images = Array.from(element.querySelectorAll("img"));
    const textCell = [];
    if (heading) textCell.push(heading);
    if (subheading) textCell.push(subheading);
    textCell.push(...ctaLinks);
    const imageCell = [...images];
    if (!textCell.length && !imageCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([textCell, imageCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-split", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document: document2 }) {
    const cols = Array.from(element.querySelectorAll(":scope > div"));
    const imageCol = cols.find((c) => c.querySelector("picture, img"));
    const textCol = cols.find((c) => c !== imageCol);
    const image = imageCol ? imageCol.querySelector("img, picture") : null;
    const textContent = textCol ? Array.from(textCol.children) : [];
    if (!image && !textContent.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCell = image ? [image] : [""];
    const textCell = textContent.length ? textContent : [""];
    const cells = [];
    cells.push([imageCell, textCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse3(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(":scope > div"));
    const cells = [];
    items.forEach((item) => {
      const image = item.querySelector("img, picture");
      const bodyContent = [];
      const title = item.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      if (title) bodyContent.push(title);
      item.querySelectorAll("p").forEach((p) => bodyContent.push(p));
      const imageCell = image ? [image] : [""];
      const bodyCell = bodyContent.length ? bodyContent : [""];
      cells.push([imageCell, bodyCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse4(element, { document: document2 }) {
    const cards = Array.from(element.querySelectorAll(":scope > a.article-card, :scope > a.card-link, :scope > a"));
    const cells = [];
    cards.forEach((card) => {
      const href = card.getAttribute("href");
      const imageWrap = card.querySelector('.article-card-image, [class*="image"]');
      const bodyWrap = card.querySelector('.article-card-body, [class*="body"]');
      const image = imageWrap ? imageWrap.querySelector("img, picture") : card.querySelector("img, picture");
      const bodyContent = [];
      if (bodyWrap) {
        const meta = bodyWrap.querySelector('.article-card-meta, [class*="meta"]');
        if (meta) bodyContent.push(meta);
        const title = bodyWrap.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
        if (title && href) {
          const link = document2.createElement("a");
          link.href = href;
          link.textContent = title.textContent;
          const headingEl = document2.createElement(title.tagName.toLowerCase());
          headingEl.append(link);
          bodyContent.push(headingEl);
        } else if (title) {
          bodyContent.push(title);
        }
      }
      const imageCell = image ? [image] : [""];
      const bodyCell = bodyContent.length ? bodyContent : [""];
      cells.push([imageCell, bodyCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse5(element, { document: document2 }) {
    const tiles = Array.from(element.querySelectorAll(":scope > div"));
    const cells = [];
    tiles.forEach((tile) => {
      const image = tile.querySelector("img, picture");
      if (image) {
        cells.push([image]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".breadcrumbs"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        ".navbar",
        "footer.footer"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections-auto.js
  var SECTION_MARKER_ATTR = "data-excat-auto-section";
  function styleForSection(el) {
    const cl = el.classList;
    if (cl.contains("secondary-section")) return "light-grey";
    if (cl.contains("accent-section")) return "accent";
    if (cl.contains("inverse-section")) return "dark";
    return null;
  }
  function topLevelSections(root) {
    const main = root.querySelector("#main-content") || root;
    return Array.from(main.children).filter((el) => el.tagName === "SECTION" || el.tagName === "HEADER");
  }
  function transform2(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      const sections = topLevelSections(element);
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const sectionEl = sections[i];
        const style = styleForSection(sectionEl);
        const hr = document.createElement("hr");
        hr.setAttribute(SECTION_MARKER_ATTR, String(i));
        if (style) hr.setAttribute("data-excat-style", style);
        if (i === 0 && !style) continue;
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      const markers = Array.from(element.querySelectorAll(`hr[${SECTION_MARKER_ATTR}]`));
      for (let i = markers.length - 1; i >= 0; i -= 1) {
        const marker = markers[i];
        const style = marker.getAttribute("data-excat-style");
        const isFirst = marker.getAttribute(SECTION_MARKER_ATTR) === "0";
        if (style) {
          const metadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style }
          });
          marker.after(metadataBlock);
        }
        marker.removeAttribute(SECTION_MARKER_ATTR);
        marker.removeAttribute("data-excat-style");
        if (isFirst) marker.remove();
      }
    }
  }

  // tools/importer/import-trend-landing.js
  var parsers = {
    "hero-split": parse,
    "columns-article": parse2,
    "cards-feature": parse3,
    "cards-article": parse4,
    "cards-gallery": parse5
  };
  var PAGE_TEMPLATE = {
    name: "trend-landing",
    description: "Trend/magazine landing page: split hero, trend-alert feature, feature-card showcase, image gallery, and closing accent CTA.",
    urls: [
      "https://wknd-trendsetters.site/fashion-trends-of-the-season",
      "https://wknd-trendsetters.site/fashion-trends-young-adults",
      "https://wknd-trendsetters.site/fashion-trends-young-adults-casual-sport"
    ],
    blocks: [
      { name: "hero-split", instances: [".secondary-section .grid-gap-xxl"] },
      { name: "columns-article", instances: [".grid-layout.grid-gap-lg:not(.desktop-3-column)"] },
      { name: "cards-feature", instances: [".grid-layout.desktop-3-column:not(.grid-gap-sm)"] },
      { name: "cards-article", instances: [".grid-layout.grid-gap-md"] },
      { name: "cards-gallery", instances: [".grid-layout.grid-gap-sm"] }
    ],
    sections: [
      {
        id: "rc1",
        name: "hero",
        selector: ["#main-content > header.section.secondary-section"],
        style: "light-grey",
        blocks: ["hero-split"],
        defaultContent: []
      },
      {
        id: "rc-sec",
        name: "secondary-section",
        selector: ["#main-content > section.section.secondary-section"],
        style: "light-grey",
        blocks: [],
        defaultContent: []
      },
      {
        id: "rc-cta",
        name: "closing-cta",
        selector: ["#main-content > section.section.accent-section"],
        style: "accent",
        blocks: [],
        defaultContent: [".container"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
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
  var import_trend_landing_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_trend_landing_exports);
})();
