import {flatten} from '../common'

const CHILD_INDEX = Symbol('childIndex')
const NO_OLD_NODE = Symbol('noOldNode')
const SAME_TYPE = Symbol('sameType')
const DIFFERENT_TYPE = Symbol('differentType')

const normalizeToComponent = child => {
  if (typeof child === 'string') return textNode()(child)
  return child
}

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
  if (node == null) return NO_OLD_NODE
  if (nodeName.toUpperCase() === node.nodeName.toUpperCase()) return SAME_TYPE
  return DIFFERENT_TYPE
}

const applyComponent = (container, targetElement, prevElement, childComponent) => {
  const compareResult = compareNodeType(targetElement, childComponent.nodeName)

  if (compareResult === SAME_TYPE) {
    return childComponent.render(targetElement)
  }

  if (compareResult === DIFFERENT_TYPE) {
    const renderedElement = childComponent.render()
    container.insertBefore(renderedElement, targetElement)
    targetElement.remove()
    return renderedElement
  }

  if (compareResult === NO_OLD_NODE) {
    const renderedElement = childComponent.render()
    const nextSibling = prevElement && prevElement.nextSibling
    if(nextSibling){
      container.insertBefore(renderedElement, nextSibling)
    }else{
      container.appendChild(renderedElement)
    }
    return renderedElement
  }
}

const groupByIndexAttr = oldChildren => oldChildren
  .reduce((arr, oldChild) => {
    const currentIndex = oldChild[CHILD_INDEX] || arr.length
    if (arr[currentIndex] == null) arr[currentIndex] = []
    arr[currentIndex].push(oldChild)
    return arr
  }, [])

const updateChildren = (container, newChildrenGroup) => {
  const oldChildren = Array.from(container.childNodes)
  const oldChildrenGroupedByIndex = groupByIndexAttr(oldChildren)

  newChildrenGroup
    .forEach((newChildren, groupIndex) => {
      const flattenedNewChildren = flatten(newChildren)
      const assignedOldChildGroup = oldChildrenGroupedByIndex[groupIndex]

      flattenedNewChildren
        .reduce((prevElement, newChild, index) => {
          const childComponent = normalizeToComponent(newChild)
          const assignedOldChild = assignedOldChildGroup && assignedOldChildGroup[index]
          const rendered = applyComponent(container, assignedOldChild, prevElement, childComponent)
          rendered[CHILD_INDEX] = groupIndex
          return rendered;
        }, null)
    })

  const oldChildrenLeftUnmatched = oldChildrenGroupedByIndex.slice(newChildrenGroup.length)
  flatten(oldChildrenLeftUnmatched).forEach(childNode => childNode.remove())
}

const rawComponent = nodeName => (attrs = {}) => (...children) => ({
  children,
  nodeName,
  render: container => {
    if (!container) {
      container = nodeName === '#text'
        ? document.createTextNode(children[0])
        : document.createElement(nodeName)
    }

    if (compareNodeType(container, nodeName) !== SAME_TYPE) {
      throw new Error('container type is not match with given one')
    }

    if (nodeName !== '#text') {
      updateAttrs(container, attrs)
      updateChildren(container, children)
    } else if (container.nodeValue !== children[0]) {
      container.nodeValue = children[0]
    }

    return container
  },
})

const textNode = rawComponent('#text')

export {rawComponent, CHILD_INDEX}
