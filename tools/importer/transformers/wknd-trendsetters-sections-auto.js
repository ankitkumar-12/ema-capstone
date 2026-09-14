/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters AUTOMATIC section breaks + Section Metadata.
 *
 * Unlike wknd-trendsetters-sections.js (which reads a fixed section list from
 * page-templates.json and is used by the single-layout about-us template), this
 * transformer works structurally: it breaks before EVERY top-level section in
 * #main-content and derives each section's style from its OWN classes. That makes
 * it robust across the trend-landing template's three pages, whose section
 * composition and order differ per page.
 *
 * Style mapping (from the source section element's class list):
 *   .secondary-section -> light-grey
 *   .accent-section    -> accent
 *   .inverse-section   -> dark
 *   (otherwise)        -> no metadata (plain white section)
 *
 * Breaks are inserted in beforeTransform (while every section element still
 * exists) using a marker <hr>; metadata is inserted in afterTransform anchored
 * to that marker (parsers may have replaced the original section contents).
 */
const SECTION_MARKER_ATTR = 'data-excat-auto-section';

function styleForSection(el) {
  const cl = el.classList;
  if (cl.contains('secondary-section')) return 'light-grey';
  if (cl.contains('accent-section')) return 'accent';
  if (cl.contains('inverse-section')) return 'dark';
  return null;
}

function topLevelSections(root) {
  const main = root.querySelector('#main-content') || root;
  return Array.from(main.children).filter((el) => el.tagName === 'SECTION' || el.tagName === 'HEADER');
}

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    const sections = topLevelSections(element);
    // Reverse so earlier inserts don't shift later element references.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const sectionEl = sections[i];
      const style = styleForSection(sectionEl);
      const hr = document.createElement('hr');
      hr.setAttribute(SECTION_MARKER_ATTR, String(i));
      if (style) hr.setAttribute('data-excat-style', style);
      // First section gets no leading break unless it is styled (needs metadata anchor).
      if (i === 0 && !style) continue;
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    const markers = Array.from(element.querySelectorAll(`hr[${SECTION_MARKER_ATTR}]`));
    // Process in reverse document order so inserts don't disturb earlier markers.
    for (let i = markers.length - 1; i >= 0; i -= 1) {
      const marker = markers[i];
      const style = marker.getAttribute('data-excat-style');
      const isFirst = marker.getAttribute(SECTION_MARKER_ATTR) === '0';
      if (style) {
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style },
        });
        marker.after(metadataBlock);
      }
      marker.removeAttribute(SECTION_MARKER_ATTR);
      marker.removeAttribute('data-excat-style');
      // The first section never needs a real leading <hr>; drop it (metadata already placed after it).
      if (isFirst) marker.remove();
    }
  }
}
