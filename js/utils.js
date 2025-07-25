/**
 * Returns the number of pixels between the top of the viewport
 * and the top of `elem`, minus any manual offset you pass in.
 *
 * @param {Element} elem
 * @param {number} offsetPx  Height (in px) to subtract (e.g. header + subheading)
 * @returns {number}  Pixels of free space above elem
 */
export function getSpaceAbove(elem, offsetPx = 0) {
  // distance from viewport top to element’s top
  const { top } = elem.getBoundingClientRect()
  return Math.max(0, top - offsetPx)
}


/**
 * Returns the total vertical space occupied by the footer element.
 *
 * @param {Element|string} [footerElem='footer']
 *        Either the footer element itself, a selector string (e.g. '#footer'),
 *        or omitted to default to the first <footer> on the page.
 * @param {boolean} [includeMargin=true]
 *        Whether to include its top & bottom margins.
 * @returns {number}  Total height in pixels
 */
export function getFooterHeight(footerElem = 'footer', includeMargin = true) {
  // If you passed nothing, footerElem === 'footer' → selects the <footer> tag
  const el = typeof footerElem === 'string'
    ? document.querySelector(footerElem)
    : footerElem

  if (!(el instanceof Element)) {
    console.warn('Footer element not found')
    return 0
  }

  // offsetHeight covers content + padding + border
  let total = el.offsetHeight

  if (includeMargin) {
    const style = window.getComputedStyle(el)
    const mTop  = parseFloat(style.marginTop)    || 0
    const mBot  = parseFloat(style.marginBottom) || 0
    total += mTop + mBot
  }

  return total
}

