/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base block: hero.
 * Source: https://wknd-trendsetters.site/about-us
 * Dark full-bleed background-image hero with overlaid text (heading, paragraph,
 * CTA). Per the hero description, this is a 1-column block: row 2 holds the
 * background image, row 3 holds the title/subheading/CTA. decorate() detects the
 * image cell and the content cell by image presence.
 */
export default function parse(element, { document }) {
  // Background image (full-bleed cover image).
  const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img, picture');

  // Text content lives in the card body: heading, subheading, CTA button group.
  const contentWrap = element.querySelector('.card-body, [class*="card-body"]');
  const heading = (contentWrap || element).querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = (contentWrap || element).querySelector('p.subheading, .subheading, p');
  const buttonGroup = (contentWrap || element).querySelector('.button-group');
  const ctaLinks = buttonGroup
    ? [buttonGroup]
    : Array.from((contentWrap || element).querySelectorAll('a.button, a.cta'));

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);

  // Empty-block guard.
  if (!bgImage && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Row 2: background image (1 cell).
  if (bgImage) cells.push([[bgImage]]);
  // Row 3: overlaid content (1 cell holding all elements).
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
