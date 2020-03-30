import jsdom from 'jsdom-global'
import chai from 'chai'
import sinon from 'sinon'
import { rawComponent } from 'src'

const expect = chai.expect

describe('RawComponent', () => {
  describe('rendering', () => {
    describe('eventHandlers', () => {
      describe('given: there is an app container element having default content', (cleanup, appContainer, Div) => {
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

          describe('and: Component\'s onClick attr is a function', (DivWithOnClickHandler, onClickHandler) => {
            beforeEach(() => DivWithOnClickHandler = Div({
              class: 'click',
              onClick: onClickHandler = sinon.fake()
            }))

            describe('when: renders on container', () => {
              beforeEach(() => DivWithOnClickHandler.render(appContainer))

              describe('and: container is clicked', () => {
                beforeEach(() => appContainer.click())

                it('then: onClick function is called', () => {
                  expect(onClickHandler.called).to.be.true
                })
              })

            })

            describe('when: renders on container repeatedly', () => {
              beforeEach(() => {
                DivWithOnClickHandler.render(appContainer)
                DivWithOnClickHandler.render(appContainer)
                DivWithOnClickHandler.render(appContainer)
                DivWithOnClickHandler.render(appContainer)
                DivWithOnClickHandler.render(appContainer)
              })

              describe('and: container is clicked', () => {
                beforeEach(() => appContainer.click())

                it('then: onClick function is called only once', () => {
                  expect(onClickHandler.callCount).to.equal(1)
                })
              })
            })
          })

          describe('and: onClick attr is an object containing listener', () => {
            describe('and: the object has an option \'once\'', (DivWithOnClickHandler, onClickHandler) => {
              beforeEach(() => DivWithOnClickHandler =
                Div({
                  onClick: {
                    listener: onClickHandler = sinon.fake(),
                    options: {
                      once: true
                    }
                  }
                }))
              describe('when: renders on container', () => {
                beforeEach(() => DivWithOnClickHandler.render(appContainer))
                describe('and: container is clicked twice', () => {
                  beforeEach(() => {
                    appContainer.click()
                    appContainer.click()
                  })

                  it('then: onClick function is called once', () => {
                    expect(onClickHandler.callCount).to.be.equal(1)
                  })
                })
              })
            })

            describe('and: the object has an option \'capture\'', (DivWithOnClickHandler, onClickHandler1, onClickHandler2) => {
              beforeEach(() => DivWithOnClickHandler = Div({
                onClick: {
                  listener: onClickHandler1 = sinon.fake(),
                  options: { capture: true }
                }
              })(Div({ onClick: onClickHandler2 = sinon.fake() })))
              describe('when: renders on container', () => {
                beforeEach(() => DivWithOnClickHandler.render(appContainer))

                describe('and: container is clicked twice', () => {
                  beforeEach(() => appContainer.childNodes[0].click())

                  it('then: onClick function is called once', () => {
                    sinon.assert.callOrder(onClickHandler1, onClickHandler2)
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})
