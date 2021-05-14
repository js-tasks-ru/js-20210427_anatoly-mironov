export default class ColumnChart {
  classNames = {
    chart: 'column-chart',
    title: 'column-chart__title',
    link: 'column-chart__link',
    container: 'column-chart__container',
    containerHeader: 'column-chart__header',
    containerBody: 'column-chart__chart',
    loading: 'column-chart_loading',
  }

  chartHeight = 50;

  constructor(chart = {}) {
    this.chart = chart;

    if (!('value' in chart)) {
      this.chart.value = 0;
    }

    this.render();
  }

  render() {
    this.element = this.getDivElement();
    this.element.className = this.classNames.chart;
    this.element.style = `--chart-height: ${this.chartHeight}`;

    this.renderTitle();
    this.renderContainer();
  }

  update(data) {
    if (this.chart.data !== data) {
      this.chart.data = data;
      this.element.querySelector(`.${this.classNames.containerBody}`).remove();
      this.renderContainerBody();
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  renderTitle() {
    const title = this.getDivElement();
    title.className = this.classNames.title;

    if ('label' in this.chart) {
      title.textContent = `Total ${this.chart.label}`;
    }

    this.element.appendChild(title);
    this.renderLink();
  }

  renderLink() {
    if (this.chart.link) {
      const linkNode = document.createElement('a');
      linkNode.className = this.classNames.link;
      linkNode.text = 'View all';
      linkNode.setAttribute('href', this.chart.link);

      this.element.querySelector(`.${this.classNames.title}`).appendChild(linkNode);
    }
  }

  renderContainer() {
    const container = this.getDivElement();
    container.className = this.classNames.container;
    this.element.appendChild(container);

    this.renderContainerHeader();
    this.renderContainerBody();
  }

  renderContainerHeader() {
    const header = this.getDivElement();
    header.className = this.classNames.containerHeader;
    header.setAttribute('data-element', 'header');
    header.textContent = 'formatHeading' in this.chart ? this.chart.formatHeading(this.chart.value) : this.chart.value;

    this.element.querySelector(`.${this.classNames.container}`).appendChild(header);
  }

  renderContainerBody() {
    const body = this.getDivElement();
    body.className = this.classNames.containerBody;
    body.setAttribute('data-element', 'body');

    this.element.querySelector(`.${this.classNames.container}`).appendChild(body);

    this.renderStatistics();
  }

  renderStatistics() {
    if ('data' in this.chart && this.chart.data.length) {
      for (const { percent, value } of this.getColumnProps()) {
        const chartValueNode = this.getDivElement();
        chartValueNode.style = `--value: ${value}`;
        chartValueNode.setAttribute('data-tooltip', percent);

        this.element.querySelector(`.${this.classNames.containerBody}`).appendChild(chartValueNode);
      }
    } else {
      this.element.classList.add(this.classNames.loading);
    }
  }

  getDivElement() {
    return document.createElement('div');
  }

  getColumnProps() {
    const maxValue = Math.max(...this.chart.data);
    const scale = this.chartHeight / maxValue;

    return this.chart.data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }
}
