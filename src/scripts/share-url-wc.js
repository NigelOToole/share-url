class ShareUrl extends HTMLElement {

  // Utilities
  checkBoolean(string) {
	  if (string.toLowerCase() === 'true') return true;
	  if (string.toLowerCase() === 'false') return false;
		return string;
  }

  camelCase(text, delimiter = '-') {
    const pattern = new RegExp((`${delimiter}([a-z])`), 'g');
    return text.replace(pattern, (match, replacement) => replacement.toUpperCase());
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } 
    catch (error) {
      return false;
    }
  }


  // Methods
  constructor() {
    super();

    this.options = {
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
      fallback: false,
    }  

		for (const item of this.getAttributeNames()) {
      let prop = this.camelCase(item);
      let value = this.checkBoolean(this.getAttribute(item));
      this.options[prop] = value;
		}

    this.platforms = [{ name: 'twitter', url: 'https://twitter.com/intent/tweet' }, { name: 'linkedin', url: 'https://www.linkedin.com/shareArticle?mini=true' }, { name: 'facebook', url: 'https://facebook.com/sharer/sharer.php', titleParameter: 't', urlParameter: 'u' }];
  }

  connectedCallback() {
    this.element = this.querySelector('button');
    if (!this.element) return;

    if ((this.options.fallback && navigator.share !== undefined)) {
      this.hideElement();
      return;
    } 

    this.textElement = this.querySelector(this.options.textSelector);
    if (this.textElement === null) this.textElement = this.element;
    if (this.options.textLabel) this.textElement.innerText = this.options.textLabel;

    if (this.options.action === 'share' || this.options.action === 'clipboard') {
      navigator[this.options.action] ? this.element.addEventListener('click', () => this.shareEvent()) : this.style.display = 'none';
    }
    else {
      this.element.addEventListener('click', () => this.sharePlatform());
    }
  } 

  hideElement() {
    this.style.display = 'none';
  };

  async shareEvent() {
    try {
      if (this.options.action === 'share') await navigator.share({ title: this.options.title, text: this.options.title, url: this.options.url });
      if (this.options.action === 'clipboard') await navigator.clipboard.writeText(this.options.url);

      this.shareSuccess();
    } 
    catch (error) {
      if (error.name !== 'AbortError') console.error(error.name, error.message);
    }
  }

  sharePlatform() {
    let platformData = this.platforms.find((item) => item.name === this.options.action);
    if (platformData) {
      this.options.action = platformData.url;
      if (platformData.titleParameter) this.options.titleParameter = platformData.titleParameter;
      if (platformData.urlParameter) this.options.urlParameter = platformData.urlParameter;
    }

    if (this.options.action === 'mastodon') {
      let mastodonInstance = localStorage.getItem('mastodon-instance');

      if (!mastodonInstance) {
        let mastodonPrompt = prompt('Enter your Mastodon instance');
        if (mastodonPrompt === '' || mastodonPrompt === null) return;

        localStorage.setItem('mastodon-instance', mastodonPrompt);
        mastodonInstance = localStorage.getItem('mastodon-instance');
      }

      this.options.action = `https://${mastodonInstance}/share`;
    }

    if (!this.isValidUrl(this.options.action)) return;


    const platformURL = new URL(this.options.action);

    if (this.options.urlParameter === '') { 
      this.options.title += ` ${this.options.url}`;
    }
    else {
      platformURL.searchParams.append(this.options.urlParameter, this.options.url);
    }

    platformURL.searchParams.append(this.options.titleParameter, this.options.title);

    window.open(platformURL.href, '_blank', 'noreferrer,noopener');
    this.shareSuccess();
  }

  shareSuccess() {
    let textWidth = this.textElement.offsetWidth;
    this.textElement.innerText = this.options.textSuccess;
    if (this.options.maintainSize) this.textElement.style.width = `${Math.max(textWidth, this.textElement.offsetWidth)}px`;
    this.element.classList.add(this.options.activeClass);
  }

}

customElements.define('share-url', ShareUrl);

export { ShareUrl };
