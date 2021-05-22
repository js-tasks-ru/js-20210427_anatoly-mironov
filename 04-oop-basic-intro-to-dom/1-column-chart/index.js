export default class ColumnChart {
  thousandsSeparatorRegExp = /\B(?=(\d{3})+(?!\d))/g;
  chartHeight = 50;

  constructor({ data = [], label = '', value = 0, link = '', formatHeading = null } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;

    this.render();
  }

  get template() {
    return `
      <div class="column-chart ${!this.data.length ? 'column-chart_loading' : ''}" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">Total ${this.label}${this.link ? this.linkTemplate : ''}</div>
        <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.formatHeading ? this.formatHeading(this.value).replace(this.thousandsSeparatorRegExp, ",") : this.value}</div>
        <div data-element="body" class="column-chart__chart">
          ${this.bodyNodesTemplate}
        </div>
      </div>
    `;
  }

  get linkTemplate() {
    return `
       <a href="${this.link}" class="column-chart__link">View all</a>
    `;
  }

  get bodyNodesTemplate() {
    return this.getColumnProps().map(prop => `<div style="--value: ${prop.value}" data-tooltip="${prop.percent}"></div>`).join('');
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;
  }

  update(data) {
    if (this.data !== data) {
      this.data = data;
      const body = this.element.querySelector(`[data-element=body]`).innerHTML = this.bodyNodesTemplate;
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  getColumnProps() {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    return this.data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }
}
