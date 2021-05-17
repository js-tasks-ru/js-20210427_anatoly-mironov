export default class SortableTable {
  constructor(headerConfig = [], { data = [] } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  get headerContent() {
    return this.headerConfig.map(({ id, title, sortable }) => `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
      </div>
    `).join('');
  }

  get bodyContent() {
    return this.data.map(({ id, title, quantity, price, sales, images = [] }) => `
      <a href="/products/${id}" class="sortable-table__row">
        <div class="sortable-table__cell">
          ${ images.length ? `<img class="sortable-table-image" alt="Image" src="${ images[0].url }">` : '' }
        </div>
        <div class="sortable-table__cell">${title}</div>

        <div class="sortable-table__cell">${quantity}</div>
        <div class="sortable-table__cell">${price}</div>
        <div class="sortable-table__cell">${sales}</div>
      </a>
    `).join('');
  }

  get template() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">${this.headerContent}</div>
          <div data-element="body" class="sortable-table__body">${this.bodyContent}</div>
          <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
          <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
        </div>
      </div>
    `;
  }

  sort(field, direction) {

  }

  render() {
    this.element = document.createElement('div');
    this.element.innerHTML = this.template;

    this.element = this.element.firstElementChild;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
