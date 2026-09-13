import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * hero-split — a two-column page-intro hero.
 * Left column: heading + supporting paragraph + CTA button group.
 * Right column: a vertical stack of supporting images.
 *
 * Authored as a block with two cells (text | images). Decorates defensively:
 * a single-cell instance still renders (text-only or image-only), and extra
 * cells are left in the flow.
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Flatten a single wrapping row into its cells so both
  // "one row / two cells" and "two rows / one cell" author shapes work.
  let cells = rows;
  if (rows.length === 1 && rows[0].children.length > 1) {
    cells = [...rows[0].children];
  }

  const textCell = cells.find((cell) => !cell.querySelector('picture, img'));
  const imageCell = cells.find((cell) => cell.querySelector('picture, img'));

  if (textCell) textCell.classList.add('hero-split-text');

  if (imageCell) {
    imageCell.classList.add('hero-split-media');
    // Optimize each supporting image while preserving stack order.
    imageCell.querySelectorAll('img').forEach((img) => {
      const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const existingPicture = img.closest('picture');
      (existingPicture || img).replaceWith(optimized);
    });
  }

  if (!imageCell) block.classList.add('no-image');
}
