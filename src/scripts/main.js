import { ShareUrl } from './share-url.js';
import { ShareUrl as ShareUrlWC } from './share-url-wc.js';

window.addEventListener('DOMContentLoaded', (event) => {
  
  // Demos
  const elements = document.querySelectorAll('.demos .share-url');
	for (const item of elements) {
		ShareUrl({ selector: item });
	};

  // Browser support
  if (!navigator.share) {
    document.querySelector('.unsupported').classList.add('is-active');
  }

  // Dynamically add the element - https://gomakethings.com/the-different-ways-to-instantiate-a-web-component/
  // let dynamicElement = document.createElement('share-url');
  // dynamicElement.setAttribute('action', 'clipboard');
  // dynamicElement.innerHTML = `<button>Dynamic share</button>`;
  // document.querySelector('.demo--wc .group').append(dynamicElement);


  
  // Site

  // Encoded text
  const encodeElements = document.querySelectorAll('.encode');
  for (const item of encodeElements) {
    let decode = atob(item.dataset['encode']);

    if (item.dataset['encodeAttribute']) {
      item.setAttribute(`${item.dataset['encodeAttribute']}`, `${decode}`);
    }
  }

  // Observe header height
  const observeHeader = function() {
    let element = document.querySelector('.header');
    let height = 0;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        let heightNew = entry.contentBoxSize[0].blockSize;

        if (height !== heightNew) {
          height = entry.contentBoxSize[0].blockSize;
  
          document.documentElement.style.setProperty(`--header-height`, `${height}px`);            
        } 
      }
  
    });
  
    resizeObserver.observe(element);
  }

  observeHeader();

});
