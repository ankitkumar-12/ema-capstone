/**
 * accordion-faq — collapsible FAQ list. Each authored row has two cells:
 * a question cell and an answer cell. Renders each as a native <details>/<summary>
 * so it toggles open/closed with no extra JS and is accessible by default.
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const questionCell = cells[0];
    const answerCell = cells[1];
    if (!questionCell) return;

    const details = document.createElement('details');
    details.className = 'accordion-faq-item';

    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-question';
    while (questionCell.firstChild) summary.append(questionCell.firstChild);

    const answer = document.createElement('div');
    answer.className = 'accordion-faq-answer';
    if (answerCell) {
      while (answerCell.firstChild) answer.append(answerCell.firstChild);
    }

    details.append(summary, answer);
    row.replaceWith(details);
  });
}
