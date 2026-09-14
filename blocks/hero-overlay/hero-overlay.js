import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * hero-overlay — a dark, full-bleed background-image hero with an overlaid
 * text block (heading, paragraph, CTA). One cell holds the background image;
 * the remaining content is layered on top over a dimming overlay.
 */
export default function decorate(block) {
  const rows = [...block.children];
  let cells = rows;
  if (rows.length === 1 && rows[0].children.length > 1) {
    cells = [...rows[0].children];
  }

  const imageCell = cells.find((cell) => cell.querySelector('picture, img'));
  const textCell = cells.find((cell) => cell !== imageCell && cell.textContent.trim());

  if (imageCell) {
    imageCell.classList.add('hero-overlay-bg');
    imageCell.querySelectorAll('img').forEach((img) => {
      const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '1600' }]);
      const picture = img.closest('picture');
      (picture || img).replaceWith(optimized);
    });
  } else {
    block.classList.add('no-image');
  }

  if (textCell) textCell.classList.add('hero-overlay-content');
}
