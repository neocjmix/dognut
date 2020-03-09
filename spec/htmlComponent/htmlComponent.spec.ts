import jsdom from 'jsdom-global'
import sampleComponent from './htmlComponent.spec.sample'
import * as fs from "fs";

const sampleResult = fs.readFileSync(__dirname + '/htmlElements.test.sample.html', 'utf8');
describe('RawComponents for html5 tags', () => {
  describe('render', () => {
    let cleanup, expected, actual;
    beforeEach('setup app container', () => {
      cleanup = jsdom();
      document.body.innerHTML = `<div id="expected">${sampleResult}</div><div id="actual"></div>`;
      expected = document.getElementById('expected');
      actual = document.getElementById('actual')
      // expected.removeAttribute("id")
      // actual.removeAttribute("id")
    });
    after('clean up', () => cleanup());

    it('', () => {
      // sampleComponent.render(actual)
      // console.log(JSON.stringify(morph(expected, actual)))
    })
  })
});
