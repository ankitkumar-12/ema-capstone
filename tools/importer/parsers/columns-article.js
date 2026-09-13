/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base block: columns.
 * Source: https://wknd-trendsetters.site/about-us
 * Two-column layout pairing a feature image with an article intro
 * (breadcrumbs, heading, byline). decorate() reads the first row's cells as
 * columns and detects the image column, so we emit one row with two cells:
 * [image] | [article intro content].
 */
export default function parse(element, { document }) {
  // The source is a grid with two direct children: image wrapper and text wrapper.
  const cols = Array.from(element.querySelectorAll(':scope > div'));

  const imageCol = cols.find((c) => c.querySelector('picture, img'));
  const textCol = cols.find((c) => c !== imageCol);

  // Extract the image element (unwrapped from its container).
  const image = imageCol ? imageCol.querySelector('img, picture') : null;

  // Article intro content: breadcrumbs, heading, byline — keep as-is.
  const textContent = textCol
    ? Array.from(textCol.children)
    : [];

  // Empty-block guard.
  if (!image && !textContent.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const imageCell = image ? [image] : [''];
  const textCell = textContent.length ? textContent : [''];

  const cells = [];
  // One row, two cells: image | article intro.
  cells.push([imageCell, textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
