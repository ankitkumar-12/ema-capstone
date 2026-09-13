/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base block: tabs.
 * Source: https://wknd-trendsetters.site/about-us
 * Avatar-tab testimonial switcher. decorate() reads each row's first cell as the
 * tab label (avatar + name) and the rest as the testimonial panel. The source
 * splits these into two sibling containers (.tab-menu buttons and .tabs-content
 * panes), so we pair them by index into 2-cell rows: [label] | [panel].
 */
export default function parse(element, { document }) {
  // Tab labels (avatar + name + role) live in the tab-menu buttons.
  const menuButtons = Array.from(
    element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button'),
  );
  // Testimonial panels live in the tab-content panes.
  const panes = Array.from(
    element.querySelectorAll('.tabs-content .tab-pane, .tab-pane'),
  );

  const count = Math.max(menuButtons.length, panes.length);
  const cells = [];

  for (let i = 0; i < count; i += 1) {
    const button = menuButtons[i];
    const pane = panes[i];

    // Label cell: use the button's inner content (avatar + name + role).
    const labelCell = button
      ? Array.from(button.children).length
        ? Array.from(button.children)
        : [button]
      : [''];

    // Panel cell: the pane's inner content (image + name + role + quote).
    const paneInner = pane
      ? Array.from(pane.children).length
        ? Array.from(pane.children)
        : [pane]
      : [''];

    cells.push([labelCell, paneInner]);
  }

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
