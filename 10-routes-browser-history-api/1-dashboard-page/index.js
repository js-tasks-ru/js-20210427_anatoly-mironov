import RangePicker from '../../08-forms-fetch-api-part-2/2-range-picker/index.js';
import ColumnChart from '../../07-async-code-fetch-api-part-1/1-column-chart/index.js';
import SortableTable from '../../07-async-code-fetch-api-part-1/2-sortable-table-v3/index.js';
import header from './bestsellers-header.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class Page {
  element;
  components = {};
  subElements = {};

  onDateSelect = ({ detail }) => {
    this.updateComponents(detail);
  }

  constructor() {
    this.charts = ['orders', 'sales', 'customers'];
  }

  get template() {
    return `
      <div class="dashboard full-height flex-column">
        <div class="content__top-panel">
          <h2 class="page-title">Панель управления</h2>
          <!-- Range Picker -->
        </div>
        <div class="dashboard__charts">
          <!-- Charts -->
        </div>
        <h3 class="block-title">Лидеры продаж</h3>
        <!-- Table -->
      </div>
    `;
  }

  initComponents() {
    this.initRangePicker();
    this.initCharts();
    this.initTable();

    Object.entries(this.components).forEach(([key, value]) => this.subElements[key] = value.element);
  }

  renderComponents() {
    this.element.querySelector('.content__top-panel').append(this.subElements['rangePicker']);

    const chartsContainer = this.element.querySelector('.dashboard__charts');
    this.charts.forEach(chartType => chartsContainer.append(this.subElements[`${chartType}Chart`]));

    this.element.append(this.subElements['sortableTable']);
  }

  updateComponents({ from, to }) {
    this.charts.forEach(chartType => this.components[`${chartType}Chart`].update(from, to));

    const tableComponent = this.components['sortableTable'];
    tableComponent.url.searchParams.set('from', from.toISOString());
    tableComponent.url.searchParams.set('to', to.toISOString());
    tableComponent.loadData().then(data => tableComponent.update(data));
  }

  render() {
    this.element = this.getElementFromTemplate(this.template);

    this.initComponents();
    this.renderComponents();
    this.initEventListeners();

    return this.element;
  }

  getElementFromTemplate(template) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    return wrapper.firstElementChild;
  }

  initRangePicker() {
    const from = new Date();
    const to = new Date();
    from.setMonth(to.getMonth() - 1);
    from.setDate(to.getDate() + 1);
    this.range = { from, to };

    this.components['rangePicker'] = new RangePicker(this.range);
  }

  initCharts() {
    this.charts.forEach(chartType => {
      this.components[`${chartType}Chart`] = new ColumnChart({
        url: `api/dashboard/${chartType}`,
        range: this.range,
        label: chartType,
        link: chartType === 'orders' ? '#' : null,
        formatHeading: chartType === 'sales' ? data => `$${data}` : null
      });

      this.components[`${chartType}Chart`].element.classList.add(`dashboard__chart_${chartType}`);
    });
  }

  initTable() {
    const url = new URL('api/dashboard/bestsellers', BACKEND_URL);
    url.searchParams.set('from', this.range.from.toISOString());
    url.searchParams.set('to', this.range.to.toISOString());

    this.components['sortableTable'] = new SortableTable(header, {
      url,
      isSortLocally: true
    });
  }

  initEventListeners() {
    this.subElements['rangePicker'].addEventListener('date-select', this.onDateSelect);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
    Object.values(this.components).forEach(component => component.destroy());
  }
}
