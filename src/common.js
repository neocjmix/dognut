import {text} from './component/text'

const isFlatMappable = obj => obj && obj.flatMap && typeof obj.flatMap === 'function'

const flatten = possibleArray => isFlatMappable(possibleArray)
  ? possibleArray.flatMap(element => flatten(element))
  : [possibleArray]

const normalizeToComponent = child => {
  if (typeof child === 'string') return text()(child)
  return child
}

export {flatten, normalizeToComponent}
