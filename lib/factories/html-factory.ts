import * as _ from 'lodash';

export class HtmlFactory {
  static createElement(element: string, content: any, attributes: { [attribute: string]: any }) {
    return `<${element}${_.map(attributes, (value, attribute) => ` ${attribute}="${value}"`).join('')}>${content}</${element}>`;
  }
}
