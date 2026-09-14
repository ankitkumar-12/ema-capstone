import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-article — a grid of linked article cards. Each authored row is one card:
 * an image cell plus a body cell containing meta (category tag + date) and a title.
 *
 * The authored meta is a single paragraph ("Casual Cool May 12"): the leading
 * token(s) are the category tag and the trailing "Mon DD" is the date. We split
 * them so the tag can render as a pill and the date as secondary text.
 */
function splitMeta(p) {
  const raw = p.textContent.trim().replace(/\s+/g, ' ');
  if (!raw) return;
  // Trailing date like "May 12", "Sept 3", "December 24".
  const match = raw.match(/^(.*?)\s+([A-Za-z]{3,9}\.?\s+\d{1,2})$/);
  const tagText = match ? match[1].trim() : raw;
  const dateText = match ? match[2].trim() : '';

  p.textContent = '';
  if (tagText) {
    const tag = document.createElement('span');
    tag.className = 'cards-article-tag';
    tag.textContent = tagText;
    p.append(tag);
  }
  if (dateText) {
    const date = document.createElement('span');
    date.className = 'cards-article-date';
    date.textContent = dateText;
    p.append(date);
  }
}

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
        const meta = div.querySelector('p');
        if (meta) {
          meta.className = 'cards-article-meta';
          splitMeta(meta);
        }
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
