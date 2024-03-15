const ShareUrl = function (args) {
	const defaults = {
		selector: '.share-url',
    activeClass: 'is-active',
    action: 'share',
    url: document.location.href,
    title: document.title,
    urlParameter: 'url',
    titleParameter: 'text',
    textSelector: null,
    textLabel: '',
    textSuccess: 'Shared',
    maintainSize: false,
	}

	let options = {...defaults, ...args};
  let element;
  let textElement;
  let platforms = [{ name: 'twitter', url: 'https://twitter.com/intent/tweet' }, { name: 'linkedin', url: 'https://www.linkedin.com/shareArticle?mini=true' }, { name: 'facebook', url: 'https://facebook.com/sharer/sharer.php', titleParameter: 't', urlParameter: 'u' }];



  // Utilities
  const checkBoolean = function (string) {
	  if (string.toLowerCase() === 'true') return true;
	  if (string.toLowerCase() === 'false') return false;
		return string;
  };

  const isValidUrl = function (string) {
    try {
      new URL(string);
      return true;
    } 
    catch (error) {
      return false;
    }
  };
  


  // Methods
  const shareSuccess = function() {
    let textWidth = textElement.offsetWidth;
    textElement.innerText = options.textSuccess;
    if (options.maintainSize) textElement.style.width = `${Math.max(textWidth, textElement.offsetWidth)}px`;
    element.classList.add(options.activeClass);
  };  
  
  const shareEvent = async () => {
    try {
      if (options.action === 'share') await navigator.share({ title: options.title, text: options.title, url: options.url });
      if (options.action === 'clipboard') await navigator.clipboard.writeText(options.url);

      shareSuccess();
    } 
    catch (error) {
      if (error.name !== 'AbortError') console.error(error.name, error.message);
    }
  };

  // https://www.bentasker.co.uk/posts/documentation/general/adding-a-share-on-mastodon-button-to-a-website.html
  // https://christianheilmann.com/2023/08/18/adding-a-share-to-mastodon-link-to-any-web-site-and-here/

  const sharePlatform = function () {
    let platformData = platforms.find((item) => item.name === options.action);
    if (platformData) {
      options.action = platformData.url;
      if (platformData.titleParameter) options.titleParameter = platformData.titleParameter;
      if (platformData.urlParameter) options.urlParameter = platformData.urlParameter;
    }

    if (options.action === 'mastodon') {
      let mastodonInstance = localStorage.getItem('mastodon-instance');

      if (!mastodonInstance) {
        let mastodonPrompt = prompt('Enter your Mastodon instance');
        if (mastodonPrompt === '' || mastodonPrompt === null) return;

        localStorage.setItem('mastodon-instance', mastodonPrompt);
        mastodonInstance = localStorage.getItem('mastodon-instance');
      }

      options.action = `https://${mastodonInstance}/share`;
    }

    if (!isValidUrl(options.action)) return;


    const platformURL = new URL(options.action);
    const platformParams = new URLSearchParams(platformURL.search);

    if (options.urlParameter === '') { 
      options.title += ` ${options.url}`;
    }
    else {
      platformParams.append(options.urlParameter, options.url);
    }

    platformParams.append(options.titleParameter, options.title);
    platformURL.search = platformParams;

    window.open(platformURL, '_blank', 'noreferrer,noopener');
    shareSuccess();
  };

  
  const setup = function() {
    let datasetOptions = {...element.dataset};
    let datasetPrefix = 'share';

		for (const item in datasetOptions) {
			if (!item.startsWith(datasetPrefix)) continue;

			let prop = item.substring(datasetPrefix.length);
			prop = prop.charAt(0).toLowerCase() + prop.substring(1);
      let value = checkBoolean(datasetOptions[item]);

			options[prop] = value;
		};


    textElement = element.querySelector(options.textSelector);
    if (textElement === null) textElement = element;
    if (options.textLabel) textElement.innerText = options.textLabel;

    if (options.action === 'share' || options.action === 'clipboard') {
      navigator[options.action] ? element.addEventListener('click', () => shareEvent()) : element.style.display = 'none';
    }
    else {
      element.addEventListener('click', () => sharePlatform());
    }
  };

  const init = function() {
    element = (typeof options.selector === 'string') ? document.querySelector(options.selector) : options.selector;
    if (!element) return;

    setup();
  };

	init();

};


const ShareUrlAuto = function () {
	const elements = document.querySelectorAll('.share-url');
	for (const item of elements) {
		ShareUrl({ selector: item });
	};
};


export { ShareUrl, ShareUrlAuto };
