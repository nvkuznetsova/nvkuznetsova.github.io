class MySelect extends HTMLElement {
  #selectButton;
  #selectPopup;
  #selectPopupSearch;
  #optionsBox;
  #shadow;
  #optionsList = [];
  #filtered = [];
  #selected = [];
  #searchSelector = '.select-popup-search';

  constructor() {
    super();
    console.log('My Select element!');
  }

  static observedAttributes = ['options', 'search-selector'];

  connectedCallback() {
    console.log('Element connected');
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#createTemplate();
  }

  disconnectedCallback() {
    console.log('Element disconnected');
  }

  adoptedCallback() {
    console.log('Element moved');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Element attribute changed');
    switch (name) {
      case 'options':
        try {
          this.#optionsList = JSON.parse(newValue) || [];
          this.#filtered = [...this.#optionsList];
          this.#renderOptions();
        } catch (error) {
          this.#optionsList = [];
          this.#filtered = [];
        }
        break;
      case 'search-selector': {
        this.#searchSelector = newValue || this.#searchSelector;
        break;
      }
      default:
        break;
    }
  }

  #openPopup = () => {
    if (this.#selectPopup) {
      this.#selectPopup.classList.toggle('open');
    }
  }

  #filterOptions = (evt) => {
    if (this.#selectPopupSearch) {
      const search = evt.target.value.toLowerCase();
      this.#filtered = this.#optionsList.filter((option) => option.toLowerCase().includes(search));
      this.#renderOptions();
    }
  }

  #createTemplate() {
    const template = document.createElement('template');
    template.innerHTML = `
        <style>
           :host {
                position: relative;
                display: inline-block;
           }

           .select-button {
                cursor: pointer;
           }

           .select-popup {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                margin-top: 16px;
            }

            .select-popup.open {
                display: block;
            }

            .select-popup-options {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                gap: 8px;
            }

            .option {
                font-size: 16px;
                text-transform: capitalize;
            }
        </style>

        <button class="select-button">Select</button>
 
        <div class="select-popup">
            <slot name="search">
                <input class="select-popup-search" placeholder="Search..." />
            </slot>
            <div class="select-popup-options"></div>
        </div>
        `;
    this.#shadow.append(template.content.cloneNode(true));

    this.#selectButton = this.#shadow.querySelector('.select-button');
    this.#selectPopup = this.#shadow.querySelector('.select-popup');
    this.#selectPopupSearch = this.#shadow.querySelector(this.#searchSelector) || this.querySelector(this.#searchSelector);;
    this.#optionsBox = this.#shadow.querySelector('.select-popup-options');
    this.#selectButton.addEventListener('click', this.#openPopup);
    this.#selectPopupSearch.addEventListener('input', this.#filterOptions);
    this.#renderOptions();
  }

  #renderOptions() {
    if (this.#optionsBox) {
      this.#optionsBox.innerHTML = '';
      this.#filtered.forEach((option) => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        label.classList.add('option');
        label.dataset.value = option;
        checkbox.type = 'checkbox';
        label.append(checkbox);
        label.append(option);

        this.#optionsBox.append(label);
      });
    }
  }
}

customElements.define(document.currentScript.dataset.name, MySelect);
