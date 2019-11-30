import {normalizeToComponent} from '../common'

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

const compareNodeType = (node, nodeName) => {
  if (node == null) return 'NO_OLD_NODE'
  if (nodeName.toUpperCase() === node.nodeName.toUpperCase()) return 'SAME_TYPE'
  return 'DIFFERENT_TYPE'
}

const updateChildren = (container, children) => {
  const oldChildren = Array.from(container.childNodes)

  children
    .forEach((child, index) => {
      const childComponent = normalizeToComponent(child)
      const oldChild = oldChildren[index]

      switch (compareNodeType(oldChild, childComponent.nodeName)) {
        case 'SAME_TYPE':
          childComponent.render(oldChild)
          break
        case 'DIFFERENT_TYPE':
          container.insertBefore(childComponent.render(), oldChild)
          oldChild.remove()
          break
        case 'NO_OLD_NODE':
          container.appendChild(childComponent.render())
          break
        default:
      }
    })

  oldChildren
    .slice(children.length)
    .forEach(childNode => childNode.remove())
}

export const rawComponent = nodeName => (attrs = {}) => (...children) => ({
  nodeName,
  render: container => {
    if (!container) {
      container = document.createElement(nodeName)
    }

    if (compareNodeType(container, nodeName) !== "SAME_TYPE") {
      throw new Error('container type is not match with given one')
    }

    updateAttrs(container, attrs)
    updateChildren(container, children)
    return container
  },
})
