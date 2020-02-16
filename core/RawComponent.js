import {flatten} from './common.js'
import {parseAbbr, trace} from './common'

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
    if (nextSibling) {
      container.insertBefore(renderedElement, nextSibling)
    } else {
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
          return rendered
        }, null)
    })

  const oldChildrenLeftUnmatched = oldChildrenGroupedByIndex.slice(newChildrenGroup.length)
  flatten(oldChildrenLeftUnmatched).forEach(childNode => childNode.remove())
}

const _rawComponent = (namespaceURI, nodeName, attrs = {}, children = []) => {
  return {
    nodeName,
    attrs,
    children,
    render(container) {
      if (!container) {
        container = namespaceURI && document.createElementNS
          ? document.createElementNS(namespaceURI, this.nodeName)
          : this.nodeName === '#text'
            ? document.createTextNode(this.children[0])
            : document.createElement(this.nodeName)
      }

      if (compareNodeType(container, this.nodeName) !== SAME_TYPE) {
        throw new Error('container type is not match with given one')
      }

      if (this.nodeName !== '#text') {
        updateAttrs(container, this.attrs)
        updateChildren(container, this.children)
      } else if (container.nodeValue !== this.children[0]) {
        container.nodeValue = this.children[0]
      }

      return container
    }
  }
}

const isChildrenArgs = args => {
  if (args[0] == null) return false // noargs
  if (typeof args[0] === 'string') return true // textNode
  if (typeof args[0].render === 'function') return true // childComponent
  return false
}

const isTemplateLiteralArgs = args => Array.isArray(args[0]) && args[0].raw != null

const initWithNodeNameAndAttrs = (nodeName, attrs) => (...children) => _rawComponent(null, nodeName, attrs, children)

const initWithNodeName = nodeName => (...args) => {
  if(isChildrenArgs(args)){
    return _rawComponent(null, nodeName, {}, args)
  }
  const attrs = isTemplateLiteralArgs(args) ? parseAbbr(trace(...args)) : args[0]
  return Object.assign(initWithNodeNameAndAttrs(nodeName, attrs), _rawComponent(null, nodeName, attrs))
}

const init = (nodeName, namespaceURI) => Object.assign(initWithNodeName(nodeName), _rawComponent(namespaceURI, nodeName))

const textNode = init('#text')

export {init as rawComponent, CHILD_INDEX}
