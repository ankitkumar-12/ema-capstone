import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-article — a grid of linked article cards. Each authored row is one card:
 * an image cell plus a body cell containing meta (tag + date) and a title.
 * If the card body contains a link, the whole card becomes clickable.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture, img')) {
        div.className = 'cards-article-image';
      } else {
        div.className = 'cards-article-body';
      }
    });
    li.classList.add('cards-article-card');
    ul.append(li);
  });

  ul.querySelectorAll('img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    const picture = img.closest('picture');
    (picture || img).replaceWith(optimized);
  });

  block.replaceChildren(ul);
}
