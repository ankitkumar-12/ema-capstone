/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base block: accordion.
 * Source: https://wknd-trendsetters.site/about-us
 * Collapsible FAQ list. Each source item is a <details> with a <summary>
 * (question) and a .faq-answer (answer). decorate() reads each row as two cells:
 * [question] | [answer], so we emit one 2-cell row per FAQ item.
 */
export default function parse(element, { document }) {
  // Each FAQ item is a <details> element.
  const items = Array.from(element.querySelectorAll(':scope > details, .faq-item, details'));

  const cells = [];
  items.forEach((item) => {
    const summary = item.querySelector('summary, .faq-question');
    const answer = item.querySelector('.faq-answer');

    // Question: prefer the text span inside the summary (excludes the +/- icon).
    let question = '';
    if (summary) {
      const questionText = summary.querySelector('span');
      question = questionText || summary.textContent.trim();
    }

    // Answer: the answer container's content, or its inner elements.
    const answerContent = answer
      ? (Array.from(answer.children).length ? Array.from(answer.children) : [answer.textContent.trim()])
      : [''];

    const questionCell = question ? [question] : [''];
    cells.push([questionCell, answerContent]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
