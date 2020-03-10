import {flatten, parseAbbr, parseTemplate} from './common'

const CHILD_INDEX = Symbol('childIndex');

enum nodeCompareResult {
    NO_OLD_NODE,
    SAME_TYPE,
    DIFFERENT_TYPE,
}

type Child = Component | string;
type Attrs = object;
type HTMLNode = Element | Text

interface DognutNode extends Node {
    [CHILD_INDEX]: number,
    remove: () => void
}

interface ComponentWithAttrs extends Component {
    (...children: Child[]): Component
}

interface ComponentWithoutAttrAndChildren extends Component {
    (attrs: Attrs): ComponentWithAttrs;

    (...children: Child[]): Component;

    (abbrebiation: TemplateStringsArray, ...variables: any[]): ComponentWithAttrs;
}

interface Component {
    nodeName: string,
    namespaceURI?: string,
    attrs: object,
    children: (Component | string)[],
    render: (container?: HTMLNode) => HTMLNode
}


const normalizeToComponent = (child: Child) => {
    if (typeof child === 'string') return textNode(child);
    return child
};

const updateAttrs = (container: Element, attrs: Attrs) => {
    const existingAttrNames = container.getAttributeNames().sort();

    Object
        .entries(attrs)
        .sort(([key1], [key2]) => key1.localeCompare(key2))
        .concat([["", null]]) // add sentinel for one iteration at least
        .forEach(([key, value]) => {

            //remove existing Attribute that is not in new Attrs
            while (existingAttrNames[0] && existingAttrNames[0] !== key) {
                container.removeAttribute(existingAttrNames[0]);
                existingAttrNames.shift()// todo: check performance and consider using index variable or [].pop()
            }

            if (key !== "") {
                container.setAttribute(key, value.toString());
                existingAttrNames.shift()
            }
        })
};

const compareNodeType = (node: Node, nodeName: string): nodeCompareResult => {
    if (node == null) return nodeCompareResult.NO_OLD_NODE;
    if (nodeName.toUpperCase() === node.nodeName.toUpperCase()) return nodeCompareResult.SAME_TYPE;
    return nodeCompareResult.DIFFERENT_TYPE
};

const applyComponent = (containerElement: Element, targetElement: HTMLNode, prevNode: HTMLNode, childComponent: Component) => {
    switch (compareNodeType(targetElement, childComponent.nodeName)) {
        case nodeCompareResult.SAME_TYPE:
            return childComponent.render(targetElement);

        case nodeCompareResult.DIFFERENT_TYPE:
            const renderedElement1 = childComponent.render();
            containerElement.insertBefore(renderedElement1, targetElement);
            targetElement.remove();
            return renderedElement1;

        case nodeCompareResult.NO_OLD_NODE:
            const renderedElement2 = childComponent.render();
            const nextSibling = prevNode && prevNode.nextSibling;
            if (nextSibling) {
                containerElement.insertBefore(renderedElement2, nextSibling)
            } else {
                containerElement.appendChild(renderedElement2)
            }
            return renderedElement2;

        default:
            throw new Error("should not reach here")
    }
};

const isDognutNode = (node: Node): node is DognutNode => CHILD_INDEX in node;

const groupByIndexAttr = (oldChildren: HTMLNode[]) => oldChildren
    .reduce((arr: HTMLNode[][], oldChild) => {
        const currentIndex = isDognutNode(oldChild) ? oldChild[CHILD_INDEX] : arr.length;
        if (arr[currentIndex] == null) arr[currentIndex] = [];
        arr[currentIndex].push(oldChild);
        return arr
    }, []);

const isHTMLNode = (node: ChildNode): node is HTMLNode => node instanceof Element || node instanceof Text;

const updateChildren = (container: Element, newChildrenGroup: any[]) => {
    const oldChildren = Array.from(container.childNodes)
        .filter(node => isHTMLNode(node))
        .map(htmlNode => htmlNode as HTMLNode);

    const oldChildrenGroupedByIndex = groupByIndexAttr(oldChildren);

    newChildrenGroup
        .forEach((newChildren, groupIndex) => {
            const flattenedNewChildren = flatten(newChildren);
            const assignedOldChildGroup = oldChildrenGroupedByIndex[groupIndex];

            flattenedNewChildren
                .reduce((prevElement, newChild, index): DognutNode => {
                    const childComponent = normalizeToComponent(newChild);
                    const assignedOldChild = assignedOldChildGroup && assignedOldChildGroup[index];
                    const rendered = applyComponent(container, assignedOldChild, prevElement, childComponent);
                    return Object.assign(rendered, {
                        [CHILD_INDEX]: groupIndex
                    })
                }, null)
        });

    const oldChildrenLeftUnmatched: HTMLNode[][] = oldChildrenGroupedByIndex.slice(newChildrenGroup.length);
    flatten(oldChildrenLeftUnmatched).forEach(childNode => childNode.remove())
};

const _rawComponent = (nodeName: string, namespaceURI?: string, attrs?: {}, children?: Child[]): Component => {
    return {
        nodeName,
        namespaceURI,
        attrs: attrs || {},
        children: children || [],
        render(container) {
            if (!container) {
                if (this.namespaceURI && document.createElementNS) {
                    container = document.createElementNS(this.namespaceURI, this.nodeName)
                } else {
                    if (this.nodeName === '#text') {
                        if (typeof this.children[0] !== 'string') {
                            throw new Error('content of textnode should be string.')
                        }
                        container = document.createTextNode(this.children[0])
                    } else {
                        container = document.createElement(this.nodeName)
                    }
                }
            }

            if (compareNodeType(container, this.nodeName) !== nodeCompareResult.SAME_TYPE) {
                throw new Error('container type is not match with given one')
            }

            if (container instanceof Element) {
                updateAttrs(container, this.attrs);
                updateChildren(container, this.children)
            }

            if (container instanceof Text && container.nodeValue !== this.children[0]) {
                if (typeof this.children[0] !== 'string') {
                    throw new Error('content of textnode should be string.')
                }
                container.nodeValue = this.children[0]
            }

            return container
        }
    }
};

const isTemplateLiteralArgs = (args: any): args is TemplateStringsArray => Array.isArray(args[0]) && 'raw' in args[0];

function isInstancesOfChildren(object: any[]): object is Child[] {
    if (object[0] == null) return false; // noargs
    if (typeof object[0] === 'string') return true; // textNode
    if (typeof object[0].render === 'function') return true; // childComponent
    return false
}

const decorateWithChildrenSetter = (component: Component): ComponentWithAttrs => {
    const childrenSetter = (...children: Child[]) => _rawComponent(component.nodeName, component.namespaceURI, component.attrs, children);
    return Object.assign(childrenSetter, component);
};


const decorateWithAttrOrChildrenSetter = (component: Component): ComponentWithoutAttrAndChildren => {
    const attrOrChildrenSetter = (...args: any[]): any => {
        if (isInstancesOfChildren(args)) {
            return _rawComponent(component.nodeName, component.namespaceURI, {}, []);
        }
        if (isTemplateLiteralArgs(args)) {
            const attrsFromAbbr = parseAbbr(parseTemplate(args[0], ...args.slice(1)));
            const componentWithAttrs = _rawComponent(component.nodeName, component.namespaceURI, attrsFromAbbr, []);
            return decorateWithChildrenSetter(componentWithAttrs);
        }
        const componentWithAttrs = _rawComponent(component.nodeName, component.namespaceURI, args[0], []);
        return decorateWithChildrenSetter(componentWithAttrs);
    };
    return Object.assign(attrOrChildrenSetter, component);
};

const init = (nodeName: string, namespaceURI?: string): ComponentWithoutAttrAndChildren =>
    decorateWithAttrOrChildrenSetter(_rawComponent(nodeName, namespaceURI));

const textNode = init('#text');

export {
    init as rawComponent,
    CHILD_INDEX,
    DognutNode,
    ComponentWithoutAttrAndChildren,
    ComponentWithAttrs,
    Component,
    Child,
    Attrs,
    HTMLNode
}
