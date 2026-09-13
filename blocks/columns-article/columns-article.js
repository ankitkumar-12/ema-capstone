import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * columns-article — a two-column layout pairing a feature image with an
 * article intro (breadcrumb, heading, byline). Image on one side, text on
 * the other. Mirrors the columns block's image-column detection so an author
 * can place the image in either cell.
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-article-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-article-img-col');
        }
      }
      // Optimize plain <img> not already wrapped in a <picture>.
      col.querySelectorAll('img').forEach((img) => {
        if (!img.closest('picture')) {
          img.replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
        }
      });
    });
  });
}
