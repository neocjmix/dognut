import jsdom from 'jsdom-global'
import chai from 'chai'
import {rawComponent} from './RawComponent'

const expect = chai.expect

describe('RawComponent', () => {
  describe('constructing', () => {
    describe('given: it is constructed with attrs and children', div => {
      beforeEach(() => (div = rawComponent('div')({ class : 'test'})('content')))
      it('then: the instance has a render method', () => expect(div.render).to.be.a('function'))
      it('and: the instance has a entered nodeName', () => expect(div.nodeName).to.equal('div'))
      it('and: the instance has entered attributes', () => expect(div.attrs).to.deep.equal({ class : 'test'}))
      it('and: the instance has entered children', () => expect(div.children).to.deep.equal(['content']))
    })

    describe('given: it is constructed without children', div => {
      beforeEach(() => (div = rawComponent('div')({ class : 'test'})))
      it('then: the instance has a render method', () => expect(div.render).to.be.a('function'))
      it('and: the instance has a entered nodeName', () => expect(div.nodeName).to.equal('div'))
      it('and: the instance has entered attributes', () => expect(div.attrs).to.deep.equal({ class : 'test'}))
      it('and: the instance has entered children', () => expect(div.children).to.deep.equal([]))
    })

    describe('given: it is constructed without attrs', div => {
      beforeEach(() => (div = rawComponent('div')('content')))
      it('then: the instance has a render method', () => expect(div.render).to.be.a('function'))
      it('and: the instance has a entered nodeName', () => expect(div.nodeName).to.equal('div'))
      it('and: the instance has entered attributes', () => expect(div.attrs).to.deep.equal({}))
      it('and: the instance has entered children', () => expect(div.children).to.deep.equal(['content']))
    })

    describe('given: it is constructed without attrs and children', div => {
      beforeEach(() => (div = rawComponent('div')))
      it('then: the instance has a render method', () => expect(div.render).to.be.a('function'))
      it('and: the instance has a entered nodeName', () => expect(div.nodeName).to.equal('div'))
      it('and: the instance has entered attributes', () => expect(div.attrs).to.deep.equal({}))
      it('and: the instance has entered children', () => expect(div.children).to.deep.equal([]))
    })

    describe('given: it is constructed with certain node name value', (div, span, foo, bar) => {
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

  describe('given: there is an app container element having default content, Div raw component and Span raw component',
    (cleanup, appContainer, Div, Span) => {
      beforeEach('setup app container and raw components', () => {
        Div = rawComponent('div')
        Span = rawComponent('span')
        cleanup = jsdom()

        document.body.innerHTML = '<div id="div">default content</div><p id="paragraph">default content</p>'
        appContainer = document.getElementById('div')
      })

      afterEach('clean up', () => cleanup())

      it('throws error when containers nodename is not match with given one', () => {
        expect(() => Div()().render(document.getElementById('paragraph'))).to.throw()
      })

      it('removes old attrs and contents not existing in new content', () => {
        Div()().render(appContainer)
        expect(appContainer.getAttributeNames()).to.have.lengthOf(0)
        expect(appContainer.innerHTML).to.equal('')
      })

      it('sets new attrs and inner content in the container', () => {
        Div({class: 'my-class'})('new content').render(appContainer)
        expect(appContainer.getAttributeNames()).to.have.lengthOf(1)
        expect(appContainer.getAttribute('class')).to.equal('my-class')
        expect(appContainer.innerHTML).to.equal('new content')
      })

      it('generates nested DOM recursivly', () => {
        Div({class: 'out'})(
          'out',
          Div({class: 'in1'})('in1'),
          Div({class: 'in2'})('in2'),
        ).render(appContainer)

        expect(appContainer.getAttributeNames()).to.have.lengthOf(1)
        expect(appContainer.getAttribute('class')).to.equal('out')
        expect(appContainer.childNodes).to.have.lengthOf(3)
        expect(appContainer.childNodes[0].nodeName).to.equal('#text')
        expect(appContainer.childNodes[0].nodeValue).to.equal('out')
        expect(appContainer.childNodes[1].nodeName).to.equal('DIV')
        expect(appContainer.childNodes[1].className).to.equal('in1')
        expect(appContainer.childNodes[1].innerHTML).to.equal('in1')
        expect(appContainer.childNodes[2].nodeName).to.equal('DIV')
        expect(appContainer.childNodes[2].className).to.equal('in2')
        expect(appContainer.childNodes[2].innerHTML).to.equal('in2')
      })

      it('If possible, each child node is preserved and only its attrs and contents are changed', () => {
        Div({class: 'out'})(
          'out1',
          Div({class: 'in1-1'})('in1-1'),
          Div({class: 'in1-2'})('in1-2'),
        ).render(appContainer)

        const out = appContainer.childNodes[0]
        const in1 = appContainer.childNodes[1]
        const in2 = appContainer.childNodes[2]
        expect(out.nodeValue).to.equal('out1')
        expect(in1.innerHTML).to.equal('in1-1')
        expect(in2.innerHTML).to.equal('in1-2')

        Div({class: 'out2'})(
          'out2',
          Div({class: 'in2-1'})('in2-1'),
          Div({class: 'in2-2'})('in2-2'),
        ).render(appContainer)

        expect(appContainer.childNodes[0]).to.equal(out)
        expect(appContainer.childNodes[1]).to.equal(in1)
        expect(appContainer.childNodes[2]).to.equal(in2)
        expect(out.nodeValue).to.equal('out2')
        expect(in1.innerHTML).to.equal('in2-1')
        expect(in2.innerHTML).to.equal('in2-2')
      })

      it('When types of old and new child node are different, replace old element with new one', () => {
        // original render
        Div({class: 'out'})(
          'out1',
          Span({class: 'in1-1'})('in1-1'),
          Div({class: 'in1-2'})('in1-2'),
        ).render(appContainer)

        const out = appContainer.childNodes[0]
        const in1 = appContainer.childNodes[1]
        const in2 = appContainer.childNodes[2]
        expect(appContainer.childNodes).to.have.lengthOf(3)

        expect(out.nodeValue).to.equal('out1')
        expect(in1.innerHTML).to.equal('in1-1')
        expect(in2.innerHTML).to.equal('in1-2')

        // update1
        Div({class: 'out2'})(
          Div({class: 'in2-1'})('in2-1'),
          Span({class: 'in2-2'})('in2-2'),
          'out2',
        ).render(appContainer)

        expect(appContainer.childNodes).to.have.lengthOf(3)

        expect(appContainer.childNodes[1]).to.equal(in1)

        expect(appContainer.childNodes[0].innerHTML).to.equal('in2-1')
        expect(appContainer.childNodes[1].innerHTML).to.equal('in2-2')
        expect(appContainer.childNodes[2].nodeValue).to.equal('out2')

        // update2
        Div({class: 'out'})(
          'out13',
          Span({class: 'in3-1'})(
            'in3-1'
          ),
          Div({class: 'in3-2'})(
            'in3-2'
          ),
        ).render(appContainer)

        expect(appContainer.childNodes).to.have.lengthOf(3)

        expect(appContainer.childNodes[1]).to.equal(in1)

        expect(appContainer.childNodes[0].nodeValue).to.equal('out13')
        expect(appContainer.childNodes[1].innerHTML).to.equal('in3-1')
        expect(appContainer.childNodes[2].innerHTML).to.equal('in3-2')
      })

      describe('with with array / iterated elements', () => {
        it('generates flattened child from any depth of array', () => {
          Div({class: 'out'})(
            'out1',
            'out2',
            [
              [
                [
                  Span()('in1-1-1'),
                  Span()('in1-1-2'),
                  Span()('in1-1-3'),
                  Span()('in1-1-4'),
                ],
                [
                  Span()('in1-2-1'),
                  Span()('in1-2-2'),
                  Span()('in1-2-3'),
                  Span()('in1-2-4'),
                ],
              ],
              [
                [
                  Span()('in2-1-1'),
                  Span()('in2-1-2'),
                  Span()('in2-1-3'),
                  Span()('in2-1-4'),
                ],
                [
                  Span()('in2-2-1'),
                  Span()('in2-2-2'),
                  Span()('in2-2-3'),
                  Span()('in2-2-4'),
                ],
              ]
            ],
            'out3',
            'out4',
          ).render(appContainer)

          expect(appContainer.childNodes[0].nodeValue).to.equal('out1')
          expect(appContainer.childNodes[1].nodeValue).to.equal('out2')
          expect(appContainer.childNodes[2].innerHTML).to.equal('in1-1-1')
          expect(appContainer.childNodes[3].innerHTML).to.equal('in1-1-2')
          expect(appContainer.childNodes[4].innerHTML).to.equal('in1-1-3')
          expect(appContainer.childNodes[5].innerHTML).to.equal('in1-1-4')
          expect(appContainer.childNodes[6].innerHTML).to.equal('in1-2-1')
          expect(appContainer.childNodes[7].innerHTML).to.equal('in1-2-2')
          expect(appContainer.childNodes[8].innerHTML).to.equal('in1-2-3')
          expect(appContainer.childNodes[9].innerHTML).to.equal('in1-2-4')
          expect(appContainer.childNodes[10].innerHTML).to.equal('in2-1-1')
          expect(appContainer.childNodes[11].innerHTML).to.equal('in2-1-2')
          expect(appContainer.childNodes[12].innerHTML).to.equal('in2-1-3')
          expect(appContainer.childNodes[13].innerHTML).to.equal('in2-1-4')
          expect(appContainer.childNodes[14].innerHTML).to.equal('in2-2-1')
          expect(appContainer.childNodes[15].innerHTML).to.equal('in2-2-2')
          expect(appContainer.childNodes[16].innerHTML).to.equal('in2-2-3')
          expect(appContainer.childNodes[17].innerHTML).to.equal('in2-2-4')
          expect(appContainer.childNodes[18].nodeValue).to.equal('out3')
          expect(appContainer.childNodes[19].nodeValue).to.equal('out4')
        })
      })

      describe('given: arrayed children is rendered on container', () => {
        let out1
        let out2
        let in1
        let in2
        let in3
        let in4
        let out3
        let out4
        let in5
        let in6
        let in7
        let in8
        let out5
        let out6

        beforeEach(() => {
          Div({class: 'out'})(
            'out1',
            'out2',
            [
              Span()('in1'),
              Span()('in2'),
              Span()('in3'),
              Span()('in4'),
            ],
            'out3',
            'out4',
            [
              Span()('in5'),
              Span()('in6'),
              Span()('in7'),
              Span()('in8'),
            ],
            'out5',
            'out6',
          ).render(appContainer)

          out1 = appContainer.childNodes[0]
          out2 = appContainer.childNodes[1]
          in1 = appContainer.childNodes[2]
          in2 = appContainer.childNodes[3]
          in3 = appContainer.childNodes[4]
          in4 = appContainer.childNodes[5]
          out3 = appContainer.childNodes[6]
          out4 = appContainer.childNodes[7]
          in5 = appContainer.childNodes[8]
          in6 = appContainer.childNodes[9]
          in7 = appContainer.childNodes[10]
          in8 = appContainer.childNodes[11]
          out5 = appContainer.childNodes[12]
          out6 = appContainer.childNodes[13]
        })

        describe('when: render with with size changing array', () => {
          beforeEach(() => {
            Div({class: 'out'})(
              'out1',
              'out2',
              [
                Span()('in1'),
                Span()('in2'),
                Span()('in3'),
                Span()('in4'),
                Span()('in5'),
                Span()('in6'),
                Span()('in7'),
                Span()('in8'),
              ],
              'out3',
              'out4',
              [
                Span()('in9'),
                Span()('in10'),
                Span()('in11'),
                Span()('in12'),
                Span()('in13'),
                Span()('in14'),
                Span()('in15'),
                Span()('in16'),
              ],
              'out5',
              'out6',
            ).render(appContainer)
          })

          it('then: elements around and between arrays are preserved', () => {
            expect(appContainer.childNodes[0]).to.equal(out1)
            expect(appContainer.childNodes[1]).to.equal(out2)
            expect(appContainer.childNodes[10]).to.equal(out3)
            expect(appContainer.childNodes[11]).to.equal(out4)
            expect(appContainer.childNodes[20]).to.equal(out5)
            expect(appContainer.childNodes[21]).to.equal(out6)
          })

          it('then: elements in the new child arrays are matched'+
            'with existing sets of elements rendered from arrays in the previous render,'+
            'in order from start.', () => {
            expect(appContainer.childNodes[2]).to.equal(in1)
            expect(appContainer.childNodes[3]).to.equal(in2)
            expect(appContainer.childNodes[4]).to.equal(in3)
            expect(appContainer.childNodes[5]).to.equal(in4)
            expect(appContainer.childNodes[6].innerHTML).to.equal('in5')
            expect(appContainer.childNodes[7].innerHTML).to.equal('in6')
            expect(appContainer.childNodes[8].innerHTML).to.equal('in7')
            expect(appContainer.childNodes[9].innerHTML).to.equal('in8')
            expect(appContainer.childNodes[12]).to.equal(in5)
            expect(appContainer.childNodes[13]).to.equal(in6)
            expect(appContainer.childNodes[14]).to.equal(in7)
            expect(appContainer.childNodes[15]).to.equal(in8)
            expect(appContainer.childNodes[16].innerHTML).to.equal('in13')
            expect(appContainer.childNodes[17].innerHTML).to.equal('in14')
            expect(appContainer.childNodes[18].innerHTML).to.equal('in15')
            expect(appContainer.childNodes[19].innerHTML).to.equal('in16')
          })
        })
      })
    })
})
