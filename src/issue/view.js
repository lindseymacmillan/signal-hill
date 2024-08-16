import { createRoot, useEffect, useState } from '@wordpress/element';
import List from './list';
import apiFetch from '@wordpress/api-fetch';

/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

/* eslint-disable no-console */
console.log( 'Hello World! (from signal-hill-murmur block)' );
/* eslint-enable no-console */

// Load react and react-dom in the front-end.
const domNodes = document.querySelectorAll('[data-murmur-list]');
domNodes.forEach(domNode => {
    const mapNode = document.querySelector('[data-murmur-map]');
    const murmurs = JSON.parse(mapNode.dataset.murmurs);
    const root = createRoot(domNode);
    root.render(<List murmurs={murmurs} />);
})