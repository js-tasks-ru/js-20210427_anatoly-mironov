export default class ColumnChart {
  containerBodyClassName = 'column-chart__chart';

  chartHeight = 50;

  constructor(chart = {}) {
    this.chart = chart;

    if (!('value' in chart)) {
      this.chart.value = 0;
    }

    this.render();
  }

  getDivElement = () => document.createElement('div');

  render() {
    this.element = this.getDivElement();
    this.element.className = 'column-chart';
    this.element.style = `--chart-height: ${this.chartHeight}`;

    this.element.appendChild(this.getTitleNode());
    this.element.appendChild(this.getContainerNode());
  }

  update(data) {
    if (this.chart.data !== data) {
      this.chart.data = data;
      this.element.querySelector(`.${this.containerBodyClassName}`).remove();
      this.getContainerBodyNode();
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  getTitleNode() {
    const titleNode = this.getDivElement();
    titleNode.className = 'column-chart__title';

    if ('label' in this.chart) {
      titleNode.textContent = `Total ${this.chart.label}`;
    }

    if ('link' in this.chart) {
      titleNode.appendChild(this.getLinkNode());
    }

    return titleNode;
  }

  getLinkNode() {
    const linkNode = document.createElement('a');
    linkNode.className = 'column-chart__link';
    linkNode.text = 'View all';
    linkNode.href = this.chart.link;

    return linkNode;
  }

  getContainerNode() {
    const containerNode = this.getDivElement();
    containerNode.className = 'column-chart__container';

    containerNode.appendChild(this.getContainerHeaderNode());
    containerNode.appendChild(this.getContainerBodyNode());

    return containerNode;
  }

  getContainerHeaderNode() {
    const headerNode = this.getDivElement();
    headerNode.className = 'column-chart__header';
    headerNode.setAttribute('data-element', 'header');
    headerNode.textContent = 'formatHeading' in this.chart ? this.chart.formatHeading(this.chart.value) : this.chart.value;

    return headerNode;
  }

  getContainerBodyNode() {
    const bodyNode = this.getDivElement();
    bodyNode.className = this.containerBodyClassName;
    bodyNode.setAttribute('data-element', 'body');

    if ('data' in this.chart && this.chart.data.length) {
      for (const { percent, value } of this.getColumnProps()) {
        const chartValueNode = this.getDivElement();
        chartValueNode.style = `--value: ${value}`;
        chartValueNode.setAttribute('data-tooltip', percent);

        bodyNode.appendChild(chartValueNode);
      }
    } else {
      this.element.classList.add('column-chart_loading');
    }

    return bodyNode;
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
