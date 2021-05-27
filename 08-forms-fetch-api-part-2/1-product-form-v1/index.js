import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  product = {};
  categories = [];

  api = '/api/rest/';

  constructor (productId) {
    this.productId = productId;
  }

  getElementFromTemplate(template) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    return wrapper.firstElementChild;
  }

  async render () {
    if (this.productId) {
      this.product = await this.getProductInfo();
      this.categories = await this.getCategories();

      this.element = this.getElementFromTemplate(this.template);
      document.body.append(this.element);

      this.element.querySelector('[name=title]').value = this.product.title;
      this.element.querySelector('[name=description]').value = this.product.description;
      this.element.querySelector('[name=price]').value = this.product.price;
      this.element.querySelector('[name=discount]').value = this.product.discount;
      this.element.querySelector('[name=quantity]').value = this.product.quantity;
    }
  }

  async getProductInfo(id = this.productId) {
    const data = await fetchJson(`${BACKEND_URL}${this.api}products?id=${id}`);
    return data[0];
  }

  getCategories() {
    return fetchJson(`${BACKEND_URL}${this.api}categories?_sort=weight&_refs=subcategory`);
  }

  get template() {
    return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          ${this.titleTemplate}
          ${this.descriptionTemplate}
          ${this.photoTemplate}
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

  get photoTemplate() {
    return `
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer">
          <ul class="sortable-list">
            <li class="products-edit__imagelist-item sortable-list__item" style="">
              <input type="hidden" name="url" value="https://i.imgur.com/MWorX2R.jpg">
              <input type="hidden" name="source" value="75462242_3746019958756848_838491213769211904_n.jpg">
              <span>
                <img src="icon-grab.svg" data-grab-handle="" alt="grab">
                <img class="sortable-table__cell-img" alt="Image" src="https://i.imgur.com/MWorX2R.jpg">
                <span>75462242_3746019958756848_838491213769211904_n.jpg</span>
              </span>
              <button type="button">
                <img src="icon-trash.svg" data-delete-handle="" alt="delete">
              </button>
            </li>
          </ul>
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
}
