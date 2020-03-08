const BETWEEN_BRACKET_AND_EQUAL = /(?<=\[).*?(?==)/
const BETWEEN_EQUAL_AND_BRACKET = /(?<==).*?(?=])/
const EVERY_PARTS_STARTS_WITH_DOT_HASH_COLON_OR_BETWEEN_BRACKET = /([\.#:].*?((?=[\.#:[])|$)|\[.*?])/g

const isFlatMappable = obj => obj && obj.flatMap && typeof obj.flatMap === 'function'

const flatten = maybeArray => isFlatMappable(maybeArray)
  ? maybeArray.flatMap(element => flatten(element))
  : [maybeArray]

const parseAbbr = expression => {
  const AttrExpMap = {
    '.': exp => ({['class']: exp.slice(1)}),
    '#': exp => ({['id']: exp.slice(1)}),
    ':': exp => ({['type']: exp.slice(1)}),
    '[': exp => ({[exp.match(BETWEEN_BRACKET_AND_EQUAL)[0]]: exp.match(BETWEEN_EQUAL_AND_BRACKET)[0]}),
  }
  const parts = expression.match(EVERY_PARTS_STARTS_WITH_DOT_HASH_COLON_OR_BETWEEN_BRACKET)
  return parts
    .map(part => AttrExpMap[part[0]](part))
    .reduce(({class: classValue1, ...attrs1}, {class: classValue2, ...attrs2}) => ({
      ...attrs1,
      ...attrs2,
      class: [classValue1, classValue2]
        .filter(classValue => classValue != null && classValue !== '')
        .join(' '),
    }))
}

const parseTemplate = (template, ...args) => template
  .map((text, index) => text + (args.length > index ? args[index] : ''))
  .join('')

export {flatten, parseAbbr, parseTemplate}
