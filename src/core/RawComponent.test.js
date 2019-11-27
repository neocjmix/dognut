import jsdom from 'jsdom-global'
import chai from 'chai'
import {div} from '../component/raw/div'
import {rawComponent} from './RawComponent'

const expect = chai.expect

describe('RawComponent', () => {
  const div = rawComponent('div')

  describe('render', () => {
    describe('generates DOM in container', () => {

      let cleanup
      let appContainer

      before('setup app container', () => {
        cleanup = jsdom()
        document.body.innerHTML = `
        <div id="div">default content</div>
        <p id="paragraph">default content</p>
      `
        appContainer = document.getElementById('div')
      })

      after('clean up', () => cleanup())

      it('throw error when containers nodename is not match with given one', () => {
        expect(() => {
          div()().render(document.getElementById('paragraph'))
        }).to.throw()
      })

      it('resets existing attrs and inner content', () => {
        div()().render(appContainer)
        expect(appContainer.getAttributeNames()).to.have.lengthOf(0)
        expect(appContainer.innerHTML).to.equal('')
      })

      it('sets new attrs and inner content', () => {
        div({class: 'my-class'})('new content').render(appContainer)
        expect(appContainer.getAttributeNames()).to.have.lengthOf(1)
        expect(appContainer.getAttribute('class')).to.equal('my-class')
        expect(appContainer.innerHTML).to.equal('new content')
      })

    })

    describe('generates nested DOM in container', () => {

      let cleanup
      let appContainer

      before('setup app container', () => {
        cleanup = jsdom()
        document.body.innerHTML = `
        <div id="div">default content</div>
        <p id="paragraph">default content</p>
      `
        appContainer = document.getElementById('div')
      })

      after('clean up', () => cleanup())

      it('nest DOM is generated recursivly', () => {
        div({class: 'out'})(
          'out',
          div({class: 'in1'})('in1'),
          div({class: 'in2'})('in2'),
        ).render(appContainer)

        expect(appContainer.getAttributeNames()).to.have.lengthOf(1)
        expect(appContainer.getAttribute('class')).to.equal('out')
        expect(appContainer.childNodes).to.have.lengthOf(3)
        expect(appContainer.childNodes[0].nodeName).to.equal('#text')
        expect(appContainer.childNodes[0].textContent).to.equal('out')
        expect(appContainer.childNodes[1].nodeName).to.equal('DIV')
        expect(appContainer.childNodes[1].className).to.equal('in1')
        expect(appContainer.childNodes[1].innerHTML).to.equal('in1')
        expect(appContainer.childNodes[2].nodeName).to.equal('DIV')
        expect(appContainer.childNodes[2].className).to.equal('in2')
        expect(appContainer.childNodes[2].innerHTML).to.equal('in2')
      })
    })

    describe('generates DOM repetedly in same container', () => {

      let cleanup
      let appContainer

      before('setup app container', () => {
        cleanup = jsdom()
        document.body.innerHTML = `
        <div id="div">default content</div>
        <p id="paragraph">default content</p>
      `
        appContainer = document.getElementById('div')
      })

      after('clean up', () => cleanup())

      it('each child node preserves and only its attrs and contents are changed ', () => {
        div({class: 'out'})(
          'out',
          div({class: 'in1'})('in1-1'),
          div({class: 'in2'})('in2-1'),
        ).render(appContainer)

        const in1 = appContainer.childNodes[1]
        const in2 = appContainer.childNodes[2]
        expect(in1.innerHTML).to.equal('in1-1')
        expect(in2.innerHTML).to.equal('in2-1')

        div({class: 'out2'})(
          'out',
          div({class: 'in1-1'})('in1-2'),
          div({class: 'in2-2'})('in2-2'),
        ).render(appContainer)

        expect(appContainer.childNodes[1]).to.equal(in1)
        expect(appContainer.childNodes[2]).to.equal(in2)
        expect(in1.innerHTML).to.equal('in1-2')
        expect(in2.innerHTML).to.equal('in2-2')
      })
    })
  })
})
