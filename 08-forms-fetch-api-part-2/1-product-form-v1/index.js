import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  product = {};
  categories = [];

  api = '/api/rest/';

  onClickDeleteImage = event => {

  }

  constructor(productId = null) {
    this.productId = productId;
  }

  getElementFromTemplate(template) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    return wrapper.firstElementChild;
  }

  async render() {
    this.categories = await this.getCategories();
    this.element = this.getElementFromTemplate(this.template);
    document.body.append(this.element);

    if (this.productId) {
      this.product = await this.getProductInfo();

      this.setProductData();
    }
  }

  async getProductInfo(id = this.productId) {
    const url = new URL(`${this.api}products`, BACKEND_URL);
    url.searchParams.set('id', id);

    const data = await fetchJson(url);
    return data[0];
  }

  getCategories() {
    const url = new URL(`${this.api}categories`, BACKEND_URL);
    url.searchParams.set('_sort', 'weight');
    url.searchParams.set('_refs', 'subcategory');

    return fetchJson(url);
  }

  get template() {
    return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          ${this.titleTemplate}
          ${this.descriptionTemplate}
          ${this.imagesTemplate}
          ${this.categoriesTemplate}
          ${this.priceTemplate}
          ${this.numberTemplate}
          ${this.statusTemplate}
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">Сохранить товар</button>
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
          <input required="" type="text" name="title" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
    `;
  }

  get descriptionTemplate() {
    return `
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
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
        <button type="button" name="uploadImage" class="button-primary-outline">
          <span>Загрузить</span>
        </button>
      </div>
    `;
  }

  get categoriesTemplate() {
    return `
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" name="subcategory">${this.subcategoriesTemplate}</select>
      </div>
    `;
  }

  get priceTemplate() {
    return `
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" name="price" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" name="discount" class="form-control" placeholder="0">
        </fieldset>
      </div>
    `;
  }

  get numberTemplate() {
    return `
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" name="quantity" placeholder="1">
      </div>
    `;
  }

  get statusTemplate() {
    return `
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" name="status">
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

  setProductData() {
    ['title', 'description', 'price', 'discount', 'quantity', 'status', 'subcategory']
      .forEach(element => {
        this.element.querySelector(`[name=${element}]`).value = this.product[element];
      });

    if (this.product.images.length) {
      this.element.querySelector('div[data-element=imageListContainer]').innerHTML = this.product.images.map(({ source, url }) => `
        <li class="products-edit__imagelist-item sortable-list__item" style="">
          <input type="hidden" name="url" value="${url}">
          <input type="hidden" name="source" value="${source}">
          <span>
            <img src="icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="Image" src="${url}">
            <span>${source}</span>
          </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
          </button>
        </li>
      `).join('');
    }
  }

  removeImage() {

  }

  initEventListeners() {
    this.element.querySelector('div[data-element=imageListContainer]').addEventListener('pointe');
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
