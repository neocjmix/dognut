import { rawComponent } from '../../src/core/RawComponent'
import chai from 'chai'

const expect = chai.expect

describe('RawComponent', () => {
  describe('constructing', () => {

    describe('given: it is constructed with selector-styled abbreviation', () => {
      describe('and: the selector-styled abbreviation does not include place holders', () => {
        let div
        beforeEach(() => (div = rawComponent('div')`:text.test-class1.test-class2#test-id[value=testValue]`))

        describe('and: with no children', () => {
          it('then: the instance has a render method', () => expect(div.render).to.be.a('function'))
          it('and: the instance has a entered nodeName', () => expect(div.nodeName).to.equal('div'))
          it('and: the instance has entered children', () => expect(div.children).to.deep.equal([]))
          it('and: the instance has entered attributes', () => expect(div.attrs).to.deep.equal({
            type: 'text',
            class: 'test-class1 test-class2',
            id: 'test-id',
            value: 'testValue',
          }))
        })

        describe('and: with children', () => {
          beforeEach(() => (div = div('content')))
          it('then: the instance has a render method', () => expect(div.render).to.be.a('function'))
          it('and: the instance has a entered nodeName', () => expect(div.nodeName).to.equal('div'))
          it('and: the instance has entered children', () => expect(div.children).to.deep.equal(['content']))
          it('and: the instance has entered attributes', () => expect(div.attrs).to.deep.equal({
            type: 'text',
            class: 'test-class1 test-class2',
            id: 'test-id',
            value: 'testValue',
          }))
        })
      })

      describe('and: the selector-styled abbreviation includes place holders', () => {
        let div
        beforeEach(() => {
          const initiatorWithChildrenOrAttr = rawComponent('div')
          div = initiatorWithChildrenOrAttr`:${'text'}.${'test-class1'}.${'test-class2'}#${'test-id'}[${'value'}=${'testValue'}]`
          return div
        })

        describe('and: with no children', () => {
          it('then: the instance has a render method', () => expect(div.render).to.be.a('function'))
          it('and: the instance has a entered nodeName', () => expect(div.nodeName).to.equal('div'))
          it('and: the instance has entered children', () => expect(div.children).to.deep.equal([]))
          it('and: the instance has entered attributes', () => expect(div.attrs).to.deep.equal({
            type: 'text',
            class: 'test-class1 test-class2',
            id: 'test-id',
            value: 'testValue',
          }))
        })

        describe('and: with children', () => {
          beforeEach(() => (div = div('content')))
          it('then: the instance has a render method', () => expect(div.render).to.be.a('function'))
          it('and: the instance has a entered nodeName', () => expect(div.nodeName).to.equal('div'))
          it('and: the instance has entered children', () => expect(div.children).to.deep.equal(['content']))
          it('and: the instance has entered attributes', () => expect(div.attrs).to.deep.equal({
            type: 'text',
            class: 'test-class1 test-class2',
            id: 'test-id',
            value: 'testValue',
          }))
        })
      })

    })

    describe('given: it is constructed with attrs', () => {
      let div
      beforeEach(() => (div = rawComponent('div')({ class: 'test' })))

      describe('and: with no children', () => {
        it('then: the instance has a render method', () => expect(div.render).to.be.a('function'))
        it('and: the instance has a entered nodeName', () => expect(div.nodeName).to.equal('div'))
        it('and: the instance has entered attributes', () => expect(div.attrs).to.deep.equal({ class: 'test' }))
        it('and: the instance has entered children', () => expect(div.children).to.deep.equal([]))
      })

      describe('and: with children', () => {
        beforeEach(() => (div = div('content')))
        it('then: the instance has a render method', () => expect(div.render).to.be.a('function'))
        it('and: the instance has a entered nodeName', () => expect(div.nodeName).to.equal('div'))
        it('and: the instance has entered attributes', () => expect(div.attrs).to.deep.equal({ class: 'test' }))
        it('and: the instance has entered children', () => expect(div.children).to.deep.equal(['content']))
      })
    })

    describe('given: it is constructed without attrs', () => {
      let div
      beforeEach(() => (div = rawComponent('div')))

      describe('and: with no children', () => {
        it('then: the instance has a render method', () => expect(div.render).to.be.a('function'))
        it('and: the instance has a entered nodeName', () => expect(div.nodeName).to.equal('div'))
        it('and: the instance has entered attributes', () => expect(div.attrs).to.deep.equal({}))
        it('and: the instance has entered children', () => expect(div.children).to.deep.equal([]))
      })

      describe('and: with children', () => {
        beforeEach(() => (div = div('content')))
        it('then: the instance has a render method', () => expect(div.render).to.be.a('function'))
        it('and: the instance has a entered nodeName', () => expect(div.nodeName).to.equal('div'))
        it('and: the instance has entered attributes', () => expect(div.attrs).to.deep.equal({}))
        it('and: the instance has entered children', () => expect(div.children).to.deep.equal(['content']))
      })
    })

    describe('given: it is constructed with certain node name value', () => {
      let div, span, foo, bar
      beforeEach(() => {
        div = rawComponent('div')({})()
        span = rawComponent('span')({})()
        foo = rawComponent('foo')({})()
        bar = rawComponent('bar')({})()
      })

      it('then: the nodeName property is equal to the node name value', () => {
        expect(div.nodeName).to.equal('div')
        expect(span.nodeName).to.equal('span')
        expect(foo.nodeName).to.equal('foo')
        expect(bar.nodeName).to.equal('bar')
      })
    })
  })
})
