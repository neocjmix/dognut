import jsdom from 'jsdom-global'
import chai from 'chai'
import {rawComponent} from './RawComponent'

const expect = chai.expect

describe('RawComponent', () => {

  describe('Renderer', () => {
    const div = rawComponent('div')
    const span = rawComponent('span')

    describe('nodeName', () => {
      it(' is the value entered for nodeName when it is created', () => {
        const divRenderer = div({})()
        const spanRenderer = span({})()

        expect(divRenderer.nodeName).to.equal('div')
        expect(divRenderer.render).to.be.a('function')

        expect(spanRenderer.nodeName).to.equal('span')
        expect(spanRenderer.render).to.be.a('function')
      })
    })

    describe('render', () => {
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

      it('throws error when containers nodename is not match with given one', () => {
        expect(() => div()().render(document.getElementById('paragraph'))).to.throw()
      })

      it('removes old attrs and contents not existing in new content', () => {
        div()().render(appContainer)
        expect(appContainer.getAttributeNames()).to.have.lengthOf(0)
        expect(appContainer.innerHTML).to.equal('')
      })

      it('sets new attrs and inner content in the container', () => {
        div({class: 'my-class'})('new content').render(appContainer)
        expect(appContainer.getAttributeNames()).to.have.lengthOf(1)
        expect(appContainer.getAttribute('class')).to.equal('my-class')
        expect(appContainer.innerHTML).to.equal('new content')
      })

      it('generates nested DOM recursivly', () => {
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

      it('if possible, each child node is preserved and only its attrs and contents are changed', () => {
        div({class: 'out'})(
          'out1',
          div({class: 'in1-1'})('in1-1'),
          div({class: 'in1-2'})('in1-2'),
        ).render(appContainer)

        const out = appContainer.childNodes[0]
        const in1 = appContainer.childNodes[1]
        const in2 = appContainer.childNodes[2]
        expect(out.textContent).to.equal('out1')
        expect(in1.innerHTML).to.equal('in1-1')
        expect(in2.innerHTML).to.equal('in1-2')

        div({class: 'out2'})(
          'out2',
          div({class: 'in2-1'})('in2-1'),
          div({class: 'in2-2'})('in2-2'),
        ).render(appContainer)

        expect(appContainer.childNodes[0]).to.equal(out)
        expect(appContainer.childNodes[1]).to.equal(in1)
        expect(appContainer.childNodes[2]).to.equal(in2)
        expect(out.textContent).to.equal('out2')
        expect(in1.innerHTML).to.equal('in2-1')
        expect(in2.innerHTML).to.equal('in2-2')
      })

      it('replace each old element with newly generated child node if they are different type each other', () => {
        // original render
        div({class: 'out'})(
          'out1',
          span({class: 'in1-1'})('in1-1'),
          div({class: 'in1-2'})('in1-2'),
        ).render(appContainer)

        const out = appContainer.childNodes[0]
        const in1 = appContainer.childNodes[1]
        const in2 = appContainer.childNodes[2]
        expect(appContainer.childNodes).to.have.lengthOf(3)

        expect(out.textContent).to.equal('out1')
        expect(in1.innerHTML).to.equal('in1-1')
        expect(in2.innerHTML).to.equal('in1-2')

        // update1
        div({class: 'out2'})(
          div({class: 'in2-1'})('in2-1'),
          span({class: 'in2-2'})('in2-2'),
          'out2',
        ).render(appContainer)

        expect(appContainer.childNodes).to.have.lengthOf(3)

        expect(appContainer.childNodes[1]).to.equal(in1)

        expect(appContainer.childNodes[0].innerHTML).to.equal('in2-1')
        expect(appContainer.childNodes[1].innerHTML).to.equal('in2-2')
        expect(appContainer.childNodes[2].textContent).to.equal('out2')

        // update2
        div({class: 'out'})(
          'out13',
          span({class: 'in3-1'})('in3-1'),
          div({class: 'in3-2'})('in3-2'),
        ).render(appContainer)

        expect(appContainer.childNodes).to.have.lengthOf(3)

        expect(appContainer.childNodes[1]).to.equal(in1)

        expect(appContainer.childNodes[0].textContent).to.equal('out13')
        expect(appContainer.childNodes[1].innerHTML).to.equal('in3-1')
        expect(appContainer.childNodes[2].innerHTML).to.equal('in3-2')
      })
    })
  })
})
