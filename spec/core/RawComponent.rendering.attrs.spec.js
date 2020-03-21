import jsdom from 'jsdom-global'
import { rawComponent } from '../../src/core/RawComponent'
import chai from 'chai'

const expect = chai.expect

describe('RawComponent', () => {
  describe('rendering', () => {
    describe('attributes', () => {
      describe('given: there is an app container element having default content', () => {
        let cleanup, appContainer, Div, Span
        beforeEach('setup app container', () => {
          cleanup = jsdom()
          document.body.innerHTML = '<div id="div">default content</div><p id="paragraph">default content</p>'
          appContainer = document.getElementById('div')
        })

        afterEach('clean up', () => cleanup())

        describe('and: there are Div raw component', () => {
          beforeEach('setup app container and raw components', () => {
            Div = rawComponent('div')
          })

          describe('when: Component renders on container', () => {
            describe('and: Component has class attr', () => {
              describe('and: class attr is Strings space separated classnames', () => {
                beforeEach('setup app container and raw components', () => {
                  Div({class:"class1 class2 class3"}).render(appContainer)
                })

                it('then: component\'s classnames are equal to container\'s classnames', () => {
                  expect(Array.from(appContainer.classList)).to.have.members(["class1", "class2", "class3"])
                })
              })

              describe('and: class attr is array contains classnames', () => {
                beforeEach('setup app container and raw components', () => {
                  Div({class:['class4', 'class5', 'class6']}).render(appContainer)
                })

                it('then: component\'s classnames are equal to container\'s classnames', () => {
                  expect(Array.from(appContainer.classList)).to.have.members(["class4", "class5", "class6"])
                })
              })
            })

            describe('and: Component has style attr', () => {
              describe('and: style attr is String', () => {
                beforeEach('setup app container and raw components', () => {
                  Div({style:'border-width: 10px; border-color: #f00; padding: 40px; margin-top: 50px;'}).render(appContainer)
                })

                it('container\'s style is equals to component\'s style attr', () => {
                  expect(appContainer.getAttribute("style")).to.equal('border-width: 10px; border-color: #f00; padding: 40px; margin-top: 50px;')
                })
              })
              describe('and: style attr is to-style(https://www.npmjs.com/package/to-style) input', () => {
                beforeEach('setup app container and raw components', () => {
                  Div({style:{
                      border: {
                        width: 1,
                        color: 'red'
                      },
                      padding: 4,
                      margin: {
                        top: 5
                      }
                    }}).render(appContainer)
                })

                it('then: container\'s style is parsed style string', () => {
                  expect(appContainer.getAttribute("style")).to.equal('border-width: 1px; border-color: red; padding: 4px; margin-top: 5px')
                })
              })
            })
          })
        })
      })
    })
  })
})
