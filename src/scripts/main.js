import { ShareUrl } from './share-url.js';
import { ShareUrl as ShareUrlWC } from './share-url-wc.js';


window.addEventListener('DOMContentLoaded', (event) => {

  // Share links
  const elements = document.querySelectorAll('.demo--default .share-url, .demo--complex .share-url');
	for (const item of elements) {
		ShareUrl({ selector: item });
	};

  
  // Encoded text
  const encodeElements = document.querySelectorAll('.encode');
  for (const item of encodeElements) {
    let decode = atob(item.dataset['encode']);

    if (item.dataset['encodeAttribute']) {
      item.setAttribute(`${item.dataset['encodeAttribute']}`, `${decode}`);
    }
  }
});