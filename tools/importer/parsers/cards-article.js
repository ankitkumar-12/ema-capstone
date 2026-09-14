/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base block: cards.
 * Source: https://wknd-trendsetters.site/about-us
 * Grid of linked article cards. Each source card is an <a> wrapping an image
 * div and a body div (meta tag/date + title). decorate() reads each row as one
 * card, detecting the image cell vs. the body cell, so we emit a 2-cell row per
 * card: [image] | [body incl. meta + linked title].
 */
export default function parse(element, { document }) {
  // Each card is a direct-child link.
  const cards = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > a.card-link, :scope > a'));

  const cells = [];
  cards.forEach((card) => {
    const href = card.getAttribute('href');
    const imageWrap = card.querySelector('.article-card-image, [class*="image"]');
    const bodyWrap = card.querySelector('.article-card-body, [class*="body"]');

    const image = imageWrap ? imageWrap.querySelector('img, picture') : card.querySelector('img, picture');

    // Body content: meta (tag + date) and title. Preserve the card link on the title.
    const bodyContent = [];
    if (bodyWrap) {
      const meta = bodyWrap.querySelector('.article-card-meta, [class*="meta"]');
      if (meta) bodyContent.push(meta);
      const title = bodyWrap.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      if (title && href) {
        // Wrap the title text in the card's link to keep the card clickable.
        const link = document.createElement('a');
        link.href = href;
        link.textContent = title.textContent;
        const headingEl = document.createElement(title.tagName.toLowerCase());
        headingEl.append(link);
        bodyContent.push(headingEl);
      } else if (title) {
        bodyContent.push(title);
      }
    }

    const imageCell = image ? [image] : [''];
    const bodyCell = bodyContent.length ? bodyContent : [''];
    cells.push([imageCell, bodyCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
