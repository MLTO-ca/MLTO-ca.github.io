import { getSpaceAbove, getFooterHeight } from './utils.js'


function resizeIframeHeight() {
	const iframe = document.querySelector('iframe')
	if (!iframe) {
		return
	}
	const spaceAboveIframe = getSpaceAbove(iframe)
	const footerHeight = getFooterHeight()

	const newHeight = (window.innerHeight - spaceAboveIframe - footerHeight - 8) + 'px'

	iframe.style.height = newHeight
}

resizeIframeHeight()
