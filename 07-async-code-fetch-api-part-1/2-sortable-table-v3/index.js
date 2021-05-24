import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  static defaultSortOrder = 'asc';

  emptyTableClass = 'sortable-table_empty';
  loadingTableClass = 'sortable-table_loading';

  columnsSortTypes = new Map();

  currentSorting = {
    id: '',
    order: ''
  };

  data = [];
  subElements = {};

  sortStrings = (arr, field, multiplier) => [...arr].sort((a, b) => multiplier * a[field].localeCompare(b[field], 'ru', { caseFirst: 'upper' }));

  sortNumbers = (arr, field, multiplier) => [...arr].sort((a, b) => multiplier * (a[field] - b[field]));

  onScroll = event => {

  }

  onSortClick = event => {
    const column = event.target.closest('[data-id]');
    const id = column.getAttribute('data-id');
    const order = column.getAttribute('data-order');

    if (this.columnsSortTypes.get(id) && (this.currentSorting.id !== id || this.currentSorting.order === order)) {
      return this.sort(id, !order || order === SortableTable.defaultSortOrder ? 'desc' : 'asc');
    }
  }

  constructor(
    headerConfig = [],
    {
      url = '',
      sorted = {
        id: headerConfig.find(item => item.sortable).id,
        order: SortableTable.defaultSortOrder
      },
      isSortLocally = false
    } = {}
  ) {
    this.url = url;
    this.headerConfig = headerConfig;
    this.isSortLocally = isSortLocally;
    this.sorted = sorted;

    this.render().catch();
  }

  get template() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">${this.headerElementsTemplate}</div>
        <div data-element="body" class="sortable-table__body">${this.getBodyElementsTemplate(this.data)}</div>
        <div data-elem="loading" class="loading-line sortable-table__loading-line"></div>
        <div data-elem="emptyPlaceholder" class="sortable-table__empty-placeholder"><div>Нет данных</div></div>
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
        ${this.headerConfig.map(column => column.template ? column.template(product[column.id]) : `<div class="sortable-table__cell">${product[column.id]}</div>`).join('')}
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

  getElementFromTemplate(template) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    return wrapper.firstElementChild;
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
  }

  async sort (id, order) {
    if (this.currentSorting.id) {
      this.subElements.header.querySelector(`[data-id=${this.currentSorting.id}]`).removeAttribute('data-order');
    }

    const columnElement = this.subElements.header.querySelector(`[data-id=${id}]`);
    columnElement.setAttribute('data-order', order);
    columnElement.append(this.subElements.sortArrow);

    this.update(this.isSortLocally ? this.sortOnClient(id, order) : await this.sortOnServer(id, order));

    this.currentSorting.id = id;
    this.currentSorting.order = order;
  }

  sortOnClient(id, order) {
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

  sortOnServer(id, order) {
    return this.loadData(id, order);
  }

  async loadData(id = this.sorted.id, order = this.sorted.order) {
    this.element.classList.add(this.loadingTableClass);
    const data = await fetchJson(`${BACKEND_URL}/${this.url}?_sort=${id}&_order=${order}&_start=0&_end=120`);
    this.element.classList.remove(this.loadingTableClass);

    return data;
  }

  update(data) {
    if (data.length) {
      this.subElements.body.innerHTML = this.getBodyElementsTemplate(data);
      this.element.classList.remove(this.emptyTableClass);
    } else {
      this.element.classList.add(this.emptyTableClass);
    }
  }

  async render() {
    this.element = this.getElementFromTemplate(this.template);
    this.subElements = this.getSubElements();
    this.subElements.sortArrow = this.getElementFromTemplate(this.sortArrowTemplate);

    this.initEventListeners();

    const data = await this.loadData();
    this.update(data);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
