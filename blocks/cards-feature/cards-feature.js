import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-feature — a grid of feature cards. Each authored row is one card:
 * an image cell plus a body cell containing a title and a short description.
 * Unlike cards-article there is no tag/date/link; unlike cards-gallery it has text.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture, img')) {
        div.className = 'cards-feature-image';
      } else {
        div.className = 'cards-feature-body';
      }
    });
    li.classList.add('cards-feature-card');
    ul.append(li);
  });

  ul.querySelectorAll('img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    const picture = img.closest('picture');
    (picture || img).replaceWith(optimized);
  });

  block.replaceChildren(ul);
}
