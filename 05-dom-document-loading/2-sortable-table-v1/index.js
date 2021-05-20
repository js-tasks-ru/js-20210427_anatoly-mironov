export default class SortableTable {
  directionMultiplier = {
    asc: 1,
    desc: -1,
  };

  columnsSortTypes = new Map();

  currentSorting = {
    column: null,
    direction: null
  };

  sortStrings = (arr, field, multiplier) => [...arr].sort((a, b) => multiplier * a[field].localeCompare(b[field], 'ru', { caseFirst: 'upper' }));

  sortNumbers = (arr, field, multiplier) => [...arr].sort((a, b) => multiplier * (a[field] - b[field]));

  static getElementFromTemplate(template) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    return wrapper.firstElementChild;
  }

  constructor(headerConfig = [], { data = [] } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  get subElements() {
    const body = this.element.querySelector(`[data-element=body]`);
    return { body };
  }

  getHeaderElements() {
    return this.headerConfig.map(({ id, title, sortable, sortType = null }) => {
      this.columnsSortTypes.set(id, sortType);

      return `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
          <span>${title}</span>
        </div>
      `;
    }).join('');
  }

  getBodyElements(data) {
    return data.map(product => `
      <a href="/products/${product.id}" class="sortable-table__row">
        ${this.headerConfig.map(column => column.template ? column.template(product.images) : `<div class="sortable-table__cell">${product[column.id]}</div>`).join('')}
      </a>
    `).join('');
  }

  get template() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">${this.getHeaderElements()}</div>
          <div data-element="body" class="sortable-table__body">${this.getBodyElements(this.data)}</div>
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

  sort(column, direction) {
    if (!this.sortArrow) {
      this.sortArrow = SortableTable.getElementFromTemplate(`
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      `);
    }

    if (this.currentSorting.column !== column || this.currentSorting.direction !== direction) {
      if (this.currentSorting.column) {
        this.element.querySelector(`[data-id=${this.currentSorting.column}]`).removeAttribute('data-order');
      }

      const columnElement = this.element.querySelector(`[data-id=${column}]`);
      columnElement.setAttribute('data-order', direction);
      columnElement.append(this.sortArrow);

      this.update(this.sortData(column, direction));

      this.currentSorting.column = column;
      this.currentSorting.direction = direction;
    }
  }

  sortData(column, direction) {
    let sortedData = [];

    switch (this.columnsSortTypes.get(column)) {
    case 'string':
      sortedData = this.sortStrings(this.data, column, this.directionMultiplier[direction]);
      break;
    case 'number':
      sortedData = this.sortNumbers(this.data, column, this.directionMultiplier[direction]);
      break;
    default:
      console.warn(`Impossible to sort data with type '${this.columnsSortTypes.get(column)}'`);
    }

    return sortedData;
  }

  update(data) {
    this.element.querySelector(`[data-element=body]`).innerHTML = this.getBodyElements(data);
  }

  render() {
    this.element = SortableTable.getElementFromTemplate(this.template);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
