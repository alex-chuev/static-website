import { expect } from 'chai';
import { HtmlFactory } from './html-factory';

describe('HtmlFactory', () => {
  describe('createElement method', () => {
    it('should work correct', () => {
      expect(HtmlFactory.createElement('a', 'text', {
        href: '/',
        class: 'link link--active',
        tabindex: '1',
      })).equal('<a href="/" class="link link--active" tabindex="1">text</a>');
    });
  });
});
