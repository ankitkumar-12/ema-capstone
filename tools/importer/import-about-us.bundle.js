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

  // tools/importer/import-about-us.js
  var import_about_us_exports = {};
  __export(import_about_us_exports, {
    default: () => import_about_us_default
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

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document: document2 }) {
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

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document: document2 }) {
    const menuButtons = Array.from(
      element.querySelectorAll(".tab-menu .tab-menu-link, .tab-menu button")
    );
    const panes = Array.from(
      element.querySelectorAll(".tabs-content .tab-pane, .tab-pane")
    );
    const count = Math.max(menuButtons.length, panes.length);
    const cells = [];
    for (let i = 0; i < count; i += 1) {
      const button = menuButtons[i];
      const pane = panes[i];
      const labelCell = button ? Array.from(button.children).length ? Array.from(button.children) : [button] : [""];
      const paneInner = pane ? Array.from(pane.children).length ? Array.from(pane.children) : [pane] : [""];
      cells.push([labelCell, paneInner]);
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document: document2 }) {
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

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(":scope > details, .faq-item, details"));
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary, .faq-question");
      const answer = item.querySelector(".faq-answer");
      let question = "";
      if (summary) {
        const questionText = summary.querySelector("span");
        question = questionText || summary.textContent.trim();
      }
      const answerContent = answer ? Array.from(answer.children).length ? Array.from(answer.children) : [answer.textContent.trim()] : [""];
      const questionCell = question ? [question] : [""];
      cells.push([questionCell, answerContent]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-overlay.js
  function parse7(element, { document: document2 }) {
    const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img, picture');
    const contentWrap = element.querySelector('.card-body, [class*="card-body"]');
    const heading = (contentWrap || element).querySelector('h1, h2, .h1-heading, [class*="heading"]');
    const subheading = (contentWrap || element).querySelector("p.subheading, .subheading, p");
    const buttonGroup = (contentWrap || element).querySelector(".button-group");
    const ctaLinks = buttonGroup ? [buttonGroup] : Array.from((contentWrap || element).querySelectorAll("a.button, a.cta"));
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    if (!bgImage && !contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([[bgImage]]);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-overlay", cells });
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

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-about-us.js
  var parsers = {
    "hero-split": parse,
    "columns-article": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-overlay": parse7
  };
  var PAGE_TEMPLATE = {
    name: "about-us",
    description: "About-us / case-study page: split hero, article intro, image gallery, testimonial tabs, article cards, FAQ, and a closing overlay CTA.",
    urls: [
      "https://wknd-trendsetters.site/about-us"
    ],
    blocks: [
      {
        name: "hero-split",
        instances: [".secondary-section .grid-gap-xxl"]
      },
      {
        name: "columns-article",
        instances: [".section:not(.secondary-section) .grid-gap-lg"]
      },
      {
        name: "cards-gallery",
        instances: [".grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-sm"]
      },
      {
        name: "tabs-testimonial",
        instances: [".tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: [".grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-md"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-list"]
      },
      {
        name: "hero-overlay",
        instances: [".inverse-section .utility-position-relative"]
      }
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
        id: "rc2",
        name: "article-intro",
        selector: ["#main-content > section.section:nth-of-type(1)"],
        style: null,
        blocks: ["columns-article"],
        defaultContent: []
      },
      {
        id: "rc3",
        name: "gallery",
        selector: ["#main-content > section.section.secondary-section:nth-of-type(2)"],
        style: "light-grey",
        blocks: ["cards-gallery"],
        defaultContent: [".utility-text-align-center"]
      },
      {
        id: "rc4",
        name: "testimonials",
        selector: ["#main-content > section.section:nth-of-type(3)"],
        style: null,
        blocks: ["tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "rc5",
        name: "latest-articles",
        selector: ["#main-content > section.section.secondary-section:nth-of-type(4)"],
        style: "light-grey",
        blocks: ["cards-article"],
        defaultContent: [".utility-text-align-center"]
      },
      {
        id: "rc6",
        name: "faq",
        selector: ["#main-content > section.section:nth-of-type(5)"],
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: [".grid-gap-xxl > div:first-child"]
      },
      {
        id: "rc7",
        name: "closing-cta",
        selector: ["#main-content > section.section.inverse-section"],
        style: "dark",
        blocks: ["hero-overlay"],
        defaultContent: []
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
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_about_us_default = {
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
  return __toCommonJS(import_about_us_exports);
})();
