const isFlatMappable = obj => obj && obj.flatMap && typeof obj.flatMap === 'function'

const flatten = maybeArray => isFlatMappable(maybeArray)
  ? maybeArray.flatMap(element => flatten(element))
  : [maybeArray]

export {flatten}
