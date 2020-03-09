import {parseAbbr} from '../../core/common'
import chai from 'chai'
import Combinatorics from 'js-combinatorics'

const expect = chai.expect

const createCombinationsOfTestSet = testSet =>
  Combinatorics.permutationCombination(testSet).toArray()
    .map(set => ({
      exp: set.map(item => item.exp).join(''),
      data: set
        .map(item => item.data)
        .reduce((
          {class: classValue1, ...data1},
          {class: classValue2, ...data2}
        ) => ({
          class: [classValue1, classValue2]
            .filter(classValue => classValue != null && classValue !== '')
            .join(' '),
          ...data1,
          ...data2
        })),
    }))

describe('common functions', () => {
  describe('parseAbbr', () => {

    describe('given: there is a class expession ', exp => {
      beforeEach(() => exp = '.test-class1')

      describe('when: parse the expession ', attr => {
        beforeEach(() => attr = parseAbbr('.test-class1'))

        it('then: result has a class attr', () => expect(attr.class).to.equal('test-class1'))
        it('and: result has no other attr', () => expect(Object.keys(attr)).to.have.lengthOf(1))
      })
    })

    describe('given: there is an id expession ', exp => {
      beforeEach(() => exp = '#test-id')

      describe('when: parse the expession ', attr => {
        beforeEach(() => attr = parseAbbr('#test-id'))

        it('then: result has an id attr', () => expect(attr.id).to.equal('test-id'))
        it('and: result has no other attr', () => expect(Object.keys(attr)).to.have.lengthOf(1))
      })
    })

    describe('given: there is a type expession ', exp => {
      beforeEach(() => exp = ':test-type')

      describe('when: parse the expession ', attr => {
        beforeEach(() => attr = parseAbbr(':test-type'))

        it('then: result has a type attr', () => expect(attr.type).to.equal('test-type'))
        it('and: result has no other attr', () => expect(Object.keys(attr)).to.have.lengthOf(1))
      })
    })

    describe('given: there is an attr expession ', exp => {
      beforeEach(() => exp = '[my-key=my-value]')

      describe('when: parse the expession ', attr => {
        beforeEach(() => attr = parseAbbr('[my-key=my-value]'))

        it('then: result has an attr', () => expect(attr['my-key']).to.equal('my-value'))
        it('and: result has no other attr', () => expect(Object.keys(attr)).to.have.lengthOf(1))
      })
    })

    describe('given: there are combinated expessions', testSet => {
      beforeEach(() => {
        testSet = createCombinationsOfTestSet([
          {exp: '.test-class1', data: {class: 'test-class1'}},
          {exp: '.test-class2', data: {class: 'test-class2'}},
          {exp: '#test-id', data: {id: 'test-id'}},
          {exp: ':test-type', data: {type: 'test-type'}},
          {exp: '[my-key1=my-value1]', data: {'my-key1': 'my-value1'}},
          {exp: '[my-key2=my-value2]', data: {'my-key2': 'my-value2'}},
          {exp: '[my-key3=my-value3]', data: {'my-key3': 'my-value3'}}
        ])
      })

      describe('when: parse each expession ', () => {
        it('then: result has right attr', () => {
          testSet.forEach(item => expect(parseAbbr(item.exp)).to.deep.equal(item.data))
        })
      })
    })
  })
})
