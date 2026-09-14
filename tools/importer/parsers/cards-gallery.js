/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base block: cards (no-images layout is not used here —
 * this is an image-only tile grid).
 * Source: https://wknd-trendsetters.site/about-us
 * Each direct-child tile holds one image. decorate() turns every authored row
 * into one <li> tile, so we emit one single-cell row per image.
 */
export default function parse(element, { document }) {
  // Each grid tile is a direct child div containing a single image.
  const tiles = Array.from(element.querySelectorAll(':scope > div'));

  const cells = [];
  tiles.forEach((tile) => {
    const image = tile.querySelector('img, picture');
    if (image) {
      // 1-column block: each row is one cell holding the image.
      cells.push([image]);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
