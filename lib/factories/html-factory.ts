import * as _ from 'lodash';
import { Attrs } from '../interfaces/attributes';

export class HtmlFactory {
  static createElement(element: string, content: any = '', attributes?: Attrs): string {
    return `<${element}${_.map(attributes, (value, attribute) => ` ${attribute}="${value}"`).join('')}>${content}</${element}>`;
  }

  static createLink(
    href: string,
    content: any = href,
    className?: string,
    activeClassName?: string,
    active?: boolean,
    attrs?: Attrs,
    language?: string,
  ): string {
    const attributes: Attrs = {href};
    const classNames = [];

    if (className) {
      classNames.push(className);
    }

    if (activeClassName && active) {
      classNames.push(activeClassName);
    }

    if (classNames.length) {
      attributes['class'] = classNames.join(' ');
    }

    if (language) {
      attributes['hreflang'] = language;
    }

    _.forEach(attrs, (value, name) => attributes[name] = value);

    return this.createElement('a', content, attributes);
  }
}
