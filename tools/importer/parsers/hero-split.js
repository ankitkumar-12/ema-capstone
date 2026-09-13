/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-split. Base block: hero.
 * Source: https://wknd-trendsetters.site/about-us
 * Two-column intro hero: text (heading + subheading + CTAs) beside a stack of images.
 * decorate() finds a text cell (no image) and an image cell, so we emit one row
 * with two cells: [text content] | [images].
 */
export default function parse(element, { document }) {
  // Text side: heading, supporting paragraph, CTA button group.
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, .subheading, p');
  const buttonGroup = element.querySelector('.button-group');
  const ctaLinks = buttonGroup
    ? [buttonGroup]
    : Array.from(element.querySelectorAll('a.button, a.cta'));

  // Image side: the supporting image stack.
  const images = Array.from(element.querySelectorAll('img'));

  const textCell = [];
  if (heading) textCell.push(heading);
  if (subheading) textCell.push(subheading);
  textCell.push(...ctaLinks);

  const imageCell = [...images];

  // Empty-block guard.
  if (!textCell.length && !imageCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // One row, two cells: text | images (decorate detects each by image presence).
  cells.push([textCell, imageCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-split', cells });
  element.replaceWith(block);
}
