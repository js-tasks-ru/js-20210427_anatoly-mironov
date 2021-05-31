import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  formFields = {
    strings: ['title', 'description', 'subcategory'],
    numbers: ['price', 'discount', 'quantity', 'status'],
  }

  productData = {};
  categories = [];

  subElements = {};

  api = '/api/rest/';

  onSubmit = async event => {
    event.preventDefault();

    await this.save();
  }

  constructor(productId = null) {
    this.productId = productId;
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

  async render() {
    await Promise.all([this.getCategories(), this.productId ? this.getProductData() : []]);

    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    document.body.append(this.element);
    this.subElements = this.getSubElements();

    if (this.productId) {
      this.displayProductData();
    }

    this.initEventListeners();
  }

  async getProductData(id = this.productId) {
    const url = new URL(`${this.api}products`, BACKEND_URL);
    url.searchParams.set('id', id);

    this.productData = (await fetchJson(url))[0];
  }

  async getCategories() {
    const url = new URL(`${this.api}categories`, BACKEND_URL);
    url.searchParams.set('_sort', 'weight');
    url.searchParams.set('_refs', 'subcategory');

    this.categories = await fetchJson(url);
  }

  get template() {
    return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid"">
          ${this.titleTemplate}
          ${this.descriptionTemplate}
          ${this.imagesTemplate}
          ${this.categoriesTemplate}
          ${this.priceTemplate}
          ${this.numberTemplate}
          ${this.statusTemplate}
          <div class="form-buttons">
            <button type="submit" id="save" class="button-primary-outline">Сохранить товар</button>
          </div>
        </form>
      </div>
    `;
  }

  get titleTemplate() {
    return `
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" id="title" name="title" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
    `;
  }

  get descriptionTemplate() {
    return `
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" id="description" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
      </div>
    `;
  }

  get imagesTemplate() {
    return `
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer">
          <ul class="sortable-list"></ul>
        </div>
        <button type="button" id="uploadImage" class="button-primary-outline">
          <span>Загрузить</span>
        </button>
      </div>
    `;
  }

  get categoriesTemplate() {
    return `
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" id="subcategory" name="subcategory">${this.subcategoriesTemplate}</select>
      </div>
    `;
  }

  get priceTemplate() {
    return `
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" id="price" name="price" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" id="discount" name="discount" class="form-control" placeholder="0">
        </fieldset>
      </div>
    `;
  }

  get numberTemplate() {
    return `
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" id="quantity" name="quantity" placeholder="1">
      </div>
    `;
  }

  get statusTemplate() {
    return `
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" id="status" name="status">
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>
      </div>
    `;
  }

  get subcategoriesTemplate() {
    return this.categories.map(category => {
      return category.subcategories.map(subcategory => {
        return `<option value="${subcategory.id}">${category.title} &gt; ${subcategory.title}</option>`;
      }).join('');
    }).join('');
  }

  displayProductData() {
    [...this.formFields.strings, ...this.formFields.numbers].forEach(field => {
      this.subElements['productForm'].querySelector(`#${field}`).value = this.productData[field];
      // todo: Не понимаю, почему для строки ниже не работают тесты. Но при этом в браузере всё отрабатывает корректно
      // this.subElements['productForm'][field].value = this.productData[field];
    });

    if (this.productData.images.length) {
      this.subElements['imageListContainer'].innerHTML = this.productData.images.map(({ source, url }) => `
        <li class="products-edit__imagelist-item sortable-list__item" style="">
          <input type="hidden" id="url" name="url" value="${url}">
          <input type="hidden" id="source" name="source" value="${source}">
          <span>
            <img src="icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="${escapeHtml(source)}" src="${escapeHtml(url)}">
            <span>${escapeHtml(source)}</span>
          </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
          </button>
        </li>
      `).join('');
    }
  }

  initEventListeners() {
    this.subElements['productForm'].addEventListener('submit', this.onSubmit);
  }

  async save() {
    const form = this.subElements['productForm'];

    this.formFields.strings.forEach(field => {
      this.productData[field] = form.querySelector(`#${field}`).value;
    });

    this.formFields.numbers.forEach(field => {
      this.productData[field] = Number(form.querySelector(`#${field}`).value);
    });

    if (!this.productData.images) {
      this.productData.images = [];
    }

    try {
      const res = await fetchJson(new URL(`${this.api}products`, BACKEND_URL), {
        method: this.productId ? 'PATCH' : 'PUT',
        body: JSON.stringify(this.productData),
        headers: {
          'content-type': 'application/json'
        }
      });

      this.element.dispatchEvent(new CustomEvent(`product-${this.productId ? 'updated' : 'saved'}`, {detail: {id: res.id}}));
      this.productId = res.id;
    } catch (error) {
      console.error(`Some error occurred: ${error}`);
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = null;
  }
}
