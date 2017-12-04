import * as _ from 'lodash';
import { Attributes } from '../interfaces/attributes';

export class HtmlFactory {
  static createElement(element: string, content: any = '', attributes?: Attributes) {
    return `<${element}${_.map(attributes, (value, attribute) => ` ${attribute}="${value}"`).join('')}>${content}</${element}>`;
  }
}
