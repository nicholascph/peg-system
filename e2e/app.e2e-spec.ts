import { PegPage } from './app.po';

describe('peg App', function() {
  let page: PegPage;

  beforeEach(() => {
    page = new PegPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
