/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature. Base block: cards.
 * Source: https://wknd-trendsetters.site/fashion-trends-of-the-season
 *
 * Follows the EDS "Cards" convention: a 2-column table, one row per card,
 * first cell = image (mandatory), second cell = text content (title +
 * description). No CTA/tag/date here (that is cards-article).
 *
 * Each source feature item is a direct-child <div> containing an image, a
 * title heading, and a short description paragraph.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > div'));

  const cells = [];
  items.forEach((item) => {
    const image = item.querySelector('img, picture');

    const bodyContent = [];
    const title = item.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    if (title) bodyContent.push(title);
    item.querySelectorAll('p').forEach((p) => bodyContent.push(p));

    const imageCell = image ? [image] : [''];
    const bodyCell = bodyContent.length ? bodyContent : [''];
    cells.push([imageCell, bodyCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
