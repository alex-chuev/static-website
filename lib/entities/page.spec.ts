import { expect } from 'chai';
import { Page } from './page';

describe('Page', () => {
  describe('createPageId', () => {
    it('should create page IDs from different paths', () => {
      expect(Page.createPageId('pages/index.pug')).equal('pages/index');
      expect(Page.createPageId('pages/index.css')).equal('pages/index');
      expect(Page.createPageId('pages/index.ts')).equal('pages/index');
      expect(Page.createPageId('pages/index.inline.css')).equal('pages/index');
      expect(Page.createPageId('pages/index.inline.ts')).equal('pages/index');
      expect(Page.createPageId('pages/index.dot.pug')).equal('pages/index.dot');
    });
  });
});
