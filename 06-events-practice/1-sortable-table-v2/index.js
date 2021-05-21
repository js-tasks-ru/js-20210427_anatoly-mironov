export default class SortableTable {
  static defaultSortOrder = 'asc';

  columnsSortTypes = new Map();

  currentSorting = {
    id: '',
    order: ''
  };

  subElements = {};

  onSortClick = event => {
    const id = event.currentTarget.getAttribute('data-id');
    let order = event.currentTarget.getAttribute('data-order');

    if (this.currentSorting.id !== id || this.currentSorting.order === order) {
      this.sort(id, !order || order === SortableTable.defaultSortOrder ? 'desc' : 'asc');
    }
  }

  sortStrings = (arr, field, multiplier) => [...arr].sort((a, b) => multiplier * a[field].localeCompare(b[field], 'ru', { caseFirst: 'upper' }));

  sortNumbers = (arr, field, multiplier) => [...arr].sort((a, b) => multiplier * (a[field] - b[field]));

  static getElementFromTemplate(template) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    return wrapper.firstElementChild;
  }

  constructor(
    headerConfig = [],
    {
      data = [],
      sorted = {
        id: headerConfig.find(item => item.sortable).id,
        order: SortableTable.defaultSortOrder
      },
      isSortLocally = true
    } = {}
  ) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.isSortLocally = isSortLocally;
    this.sorted = sorted;

    this.render();

    this.sort(sorted.id, sorted.order);
  }

  get template() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">${this.headerElementsTemplate}</div>
          <div data-element="body" class="sortable-table__body">${this.getBodyElementsTemplate(this.data)}</div>
        </div>
      </div>
    `;
  }

  get headerElementsTemplate() {
    return this.headerConfig.map(({ id, title, sortable, sortType = null }) => {
      this.columnsSortTypes.set(id, sortType);

      return `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
          <span>${title}</span>
        </div>
      `;
    }).join('');
  }

  get sortArrowTemplate() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  getBodyElementsTemplate(data) {
    return data.map(product => `
      <a href="/products/${product.id}" class="sortable-table__row">
        ${this.headerConfig.map(column => column.template ? column.template(product.images) : `<div class="sortable-table__cell">${product[column.id]}</div>`).join('')}
      </a>
    `).join('');
  }

  getSubElements(element = this.element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  initEventListeners() {
    this.subElements.header.querySelectorAll('.sortable-table__cell').forEach(column => {
      if (this.columnsSortTypes.get(column.getAttribute('data-id'))) {
        column.addEventListener('pointerdown', this.onSortClick);
      }
    });
  }

  sort (id, order) {
    if (this.currentSorting.id) {
      this.subElements.header.querySelector(`[data-id=${this.currentSorting.id}]`).removeAttribute('data-order');
    }

    const columnElement = this.subElements.header.querySelector(`[data-id=${id}]`);
    columnElement.setAttribute('data-order', order);
    columnElement.append(this.subElements.sortArrow);

    this.update(this.isSortLocally ? this.sortDataOnClient(id, order) : this.sortDataOnServer());

    this.currentSorting.id = id;
    this.currentSorting.order = order;
  }

  sortDataOnClient(id, order) {
    const orderMultiplier = { asc: 1, desc: -1 };

    switch (this.columnsSortTypes.get(id)) {
    case 'string':
      return this.sortStrings(this.data, id, orderMultiplier[order]);
    case 'number':
      return this.sortNumbers(this.data, id, orderMultiplier[order]);
    default:
      console.warn(`Impossible to sort data with type '${this.columnsSortTypes.get(id)}'`);
    }

    return this.data;
  }

  // todo
  sortDataOnServer() {}

  update(data) {
    this.subElements.body.innerHTML = this.getBodyElementsTemplate(data);
  }

  render() {
    this.element = SortableTable.getElementFromTemplate(this.template);
    this.subElements = this.getSubElements();
    this.subElements.sortArrow = SortableTable.getElementFromTemplate(this.sortArrowTemplate);

    this.initEventListeners();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
