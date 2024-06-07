import { ShareUrl } from './share-url.js';
import { ShareUrl as ShareUrlWC } from './share-url-wc.js';

window.addEventListener('DOMContentLoaded', (event) => {

  // Demos
  const elements = document.querySelectorAll('.demo--default .share-url, .demo--complex .share-url');
	for (const item of elements) {
		ShareUrl({ selector: item });
	};


  // Browser support
  if (!navigator.share) {
    document.querySelector('.unsupported').classList.add('is-active');
  }

  
  // Encoded text
  const encodeElements = document.querySelectorAll('.encode');
  for (const item of encodeElements) {
    let decode = atob(item.dataset['encode']);

    if (item.dataset['encodeAttribute']) {
      item.setAttribute(`${item.dataset['encodeAttribute']}`, `${decode}`);
    }
  }


  // Dynamically add the element - https://gomakethings.com/the-different-ways-to-instantiate-a-web-component/
  // let dynamicElement = document.createElement('share-url');
  // dynamicElement.innerHTML = `<button>Dynamic share</button>`;
  // dynamicElement.setAttribute('action', 'clipboard');
  // document.querySelector('.demo--wc .group').append(dynamicElement);
});