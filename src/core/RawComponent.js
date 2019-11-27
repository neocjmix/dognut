import {flatten, normalizeToComponent} from '../common'

const updateAttrs = (container, attrs) => {
  const existingAttrNames = container.getAttributeNames().sort()

  Object
    .entries(attrs)
    .sort(([key1], [key2]) => key1 - key2)
    .concat([[null]]) // add sentinel for one iteration at least
    .forEach(([key, value]) => {

      //remove existing Attribute that is not in new Attrs
      while (existingAttrNames[0] && existingAttrNames[0] !== key) {
        container.removeAttribute(existingAttrNames[0])
        existingAttrNames.shift()// todo: check performance and consider using index variable or [].pop()
      }

      if (key !== null) {
        container.setAttribute(key, value.toString())
        existingAttrNames.shift()
      }
    })
}

const updateChildren = (container, children) => {
  const existingChilds = [].slice.apply(container.childNodes)

  flatten(children).map(normalizeToComponent)
    .forEach((component, index) => {
      const childNode = existingChilds.shift()
      if (childNode) {
        component.render(childNode)
      } else {
        container.appendChild(component.render())
      }
    })

  existingChilds.forEach(childNode => childNode.remove())
}

export const rawComponent = tagName => (attrs = {}) => (...children) => ({
  tagName,
  render: container => {
    if (!container) {
      container = document.createElement(tagName)
    }

    if (container.nodeName.toLowerCase() !== tagName.toLowerCase()) {
      throw new Error('container type is not match with given one')
    }

    updateAttrs(container, attrs)
    updateChildren(container, children)
    return container
  },
})
