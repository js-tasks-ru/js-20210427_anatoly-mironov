export default class SortableTable {
  directionMultiplier = {
    asc: 1,
    desc: -1,
  };

  columnsSortTypes = new Map();

  currentSorting = {
    column: '',
    direction: ''
  };

  constructor(headerConfig = [], { data = [] } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  static getElementFromTemplate(template) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    return wrapper.firstElementChild;
  }

  get subElements() {
    const body = this.element.querySelector(`[data-element=body]`);
    return { body };
  }

  getHeaderTemplate() {
    return this.headerConfig.map(({ id, title, sortable, sortType = null }) => {
      this.columnsSortTypes.set(id, sortType);

      return `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
          <span>${title}</span>
        </div>
      `;
    }).join('');
  }

  getBodyTemplate(data) {
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
          <div data-element="header" class="sortable-table__header sortable-table__row">${this.getHeaderTemplate()}</div>
          <div data-element="body" class="sortable-table__body">${this.getBodyTemplate(this.data)}</div>
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
      const fieldElement = this.element.querySelector(`[data-id=${column}]`);
      fieldElement.setAttribute('data-order', direction);
      fieldElement.append(this.sortArrow);

      switch (this.columnsSortTypes.get(column)) {
      case 'string':
        this.sortedData = this.sortStrings(this.data, column, this.directionMultiplier[direction]);
        break;
      case 'number':
        this.sortedData = this.sortNumbers(this.data, column, this.directionMultiplier[direction]);
        break;
      default:
        console.warn(`Impossible to sort data with type '${this.columnsSortTypes.get(column)}'`);
      }

      this.update(this.sortedData);

      this.currentSorting.column = column;
      this.currentSorting.direction = direction;
    }
  }

  sortStrings = (arr, field, multiplier) => [...arr].sort((a, b) => multiplier * a[field].localeCompare(b[field], 'ru', { caseFirst: 'upper' }));

  sortNumbers = (arr, field, multiplier) => [...arr].sort((a, b) => multiplier * (a[field] - b[field]));

  update(data) {
    this.element.querySelector(`[data-element=body]`).innerHTML = this.getBodyTemplate(data);
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
