class ShareUrl extends HTMLElement {

  // Utilities
  checkBoolean(string) {
	  if (string.toLowerCase() === 'true') return true;
	  if (string.toLowerCase() === 'false') return false;
		return string;
  };

  camelCase(name, delim = '-') {
    const pattern = new RegExp((delim + "([a-z])"), "g");
    return name.replace(pattern, (match, capture) => capture.toUpperCase());
  };


  // Methods
  constructor() {
    super();

    this.options = {
      selector: '.share-url',
      activeClass: 'is-active',
      action: 'share',
      url: document.location.href,
      title: document.title,
      textSelector: null,
      textLabel: '',
      textSuccess: 'Shared',
      maintainSize: false
    }  

		for (const item of this.getAttributeNames()) {
      let prop = this.camelCase(item);
      let value = this.checkBoolean(this.getAttribute(item));
      this.options[prop] = value;
      // console.log(`${prop}: ${value}`);
		}

    // console.log(this.options);

    this.button = this.querySelector('button');

    this.textElement = this.querySelector(this.options.textSelector);
    if (this.textElement === null) this.textElement = this.button;
    if (this.options.textLabel) this.textElement.innerText = this.options.textLabel;
  };

  connectedCallback() {
    if (navigator[this.options.action]) {
      this.button.addEventListener('click', () => this.shareEvent());
    }
    else {
      console.log(this, this.button, this.options.action)
      this.style.display = 'none';
    }
  } 


  async shareEvent() {
    try {
      if (this.options.action === 'share') {
        await navigator.share({ title: this.options.title, text: this.options.title, url: this.options.url });
      }

      if (this.options.action === 'clipboard') {
        await navigator.clipboard.writeText(this.options.url);
      }

      let textWidth = this.textElement.offsetWidth;
      this.textElement.innerText = this.options.textSuccess;
      if (this.options.maintainSize) this.textElement.style.width = `${Math.max(textWidth, this.textElement.offsetWidth)}px`;
      this.button.classList.add(this.options.activeClass);
    } 
    catch (error) {
      if (error.name !== 'AbortError') console.error(error.name, error.message);
    }
  }

}

customElements.define('share-url', ShareUrl);

export { ShareUrl };
