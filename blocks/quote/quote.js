/**
 * quote — a pull-quote block with a quotation and an attribution line.
 * Authored as two rows: the first cell is the quotation, the (optional) second
 * cell is the attribution. Decorates into a semantic <blockquote> with the
 * attribution wrapped in <cite>. Renders defensively if the attribution is omitted.
 */
export default function decorate(block) {
  const [quotation, attribution] = [...block.children].map((c) => c.firstElementChild);

  const blockquote = document.createElement('blockquote');

  if (quotation) {
    quotation.className = 'quote-quotation';
    blockquote.append(quotation);
  }

  if (attribution) {
    attribution.className = 'quote-attribution';
    // Emphasized text in the attribution becomes a semantic <cite>.
    attribution.querySelectorAll('em').forEach((em) => {
      const cite = document.createElement('cite');
      cite.innerHTML = em.innerHTML;
      em.replaceWith(cite);
    });
    blockquote.append(attribution);
  }

  block.replaceChildren(blockquote);
}
