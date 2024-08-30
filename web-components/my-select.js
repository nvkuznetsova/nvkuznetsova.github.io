class MySelect extends HTMLElement {
  #selectButton;
  #selectPopup;
  #selectPopupSearch;
  #optionsBox;
  #shadow;
  #optionsList = [];
  #filtered = [];
  #selected = [];

  constructor() {
    super();
    console.log('My Select element!');
  }

  static observedAttributes = [];

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
                min-width: 200px;
                width: 250px;
           }

           .select-element {
              display: flex;
              justify-content: flex-end;
              background: #ffffff;
              border: 1px solid #cbd5e1;
              transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s, outline-color 0.2s;
              border-radius: 6px;
              cursor: pointer;
           }

           .selected-options {
              min-width: 150px;
              min-height: 30px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
           }

           .select-button {
              min-width: 30px;
              min-height: 30px;
              background-color: #ffffff;
              border: none;
              border-top-right-radius: 6px;
              border-bottom-right-radius: 6px;
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

            .arrow {
              border: solid #94a3b8;
              border-width: 0 2px 2px 0;
              display: inline-block;
              padding: 3px;
            }

            .down {
              transform: rotate(45deg);
              -webkit-transform: rotate(45deg);
            }
        </style>

        <div class='select-element'>
          <div class='selected-options'></div>
          <button class="select-button"><i class='arrow down'></i></button>
        </div>
 
        <div class="select-popup">
            <slot name="search">
                <input class="select-popup-search" placeholder="Search..." />
            </slot>
            <div class="select-popup-options"></div>
        </div>
        `;
    this.#shadow.append(template.content.cloneNode(true));

    this.#selectButton = this.#shadow.querySelector('.select-element');
    this.#selectPopup = this.#shadow.querySelector('.select-popup');
    this.#selectPopupSearch = this.querySelector('my-select input') || this.#shadow.querySelector('.select-popup input');;
    this.#optionsBox = this.#shadow.querySelector('.select-popup-options');
    this.#selectButton.addEventListener('click', this.#openPopup);
    this.#selectPopupSearch.addEventListener('input', this.#filterOptions);

    this.#optionsList = Array.from(this.querySelectorAll('option')).map((option) => {
      const value = option.textContent;
      option.remove();
      return value;
    });
    this.#filtered = [...this.#optionsList];

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
