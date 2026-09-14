import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-gallery — an image-only grid of square tiles. Each authored row is one
 * image; renders as a responsive multi-column grid with 1:1 aspect tiles.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    li.classList.add('cards-gallery-tile');
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    const picture = img.closest('picture');
    (picture || img).replaceWith(optimized);
  });
  block.replaceChildren(ul);
}
