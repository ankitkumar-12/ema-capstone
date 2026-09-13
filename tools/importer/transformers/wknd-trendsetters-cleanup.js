/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 * Removes non-authorable global chrome and in-content navigation so the
 * import contains only page-level authorable content.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Breadcrumbs sit INSIDE the article-intro block region
    // (#main-content > section.section .grid-gap-lg > div > div.breadcrumbs).
    // Remove before block parsing so the columns-article parser doesn't
    // capture the breadcrumb trail into its cells.
    // Found in cleaned.html: <div class="breadcrumbs"> ... </div>
    WebImporter.DOMUtils.remove(element, ['.breadcrumbs']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (all found in cleaned.html):
    //   <a class="skip-link">           skip-to-content link
    //   <div class="navbar">            global header / nav / mega menu
    //   <footer class="footer inverse-footer"> global footer
    // NOTE: do NOT remove bare `header` — the hero section (rc1) is
    // <header class="section secondary-section"> inside #main-content.
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',
      '.navbar',
      'footer.footer',
    ]);
  }
}
