import {flatten, parseAbbr, parseTemplate} from './common'
import {string as toStyleString} from 'to-style';

const CHILD_INDEX = Symbol('childIndex');

enum nodeCompareResult {
    NO_OLD_NODE,
    SAME_TYPE,
    DIFFERENT_TYPE,
}

type Child = Component | string | boolean | undefined | null | number;
type Attrs = { [key: string]: any };
type HTMLNode = Element | Text
type RawComponentFactory = (nodeName: string, namespaceURI?: string) => AbbrAttrChildrenAddable & Component

interface DognutNode extends Node {
    [CHILD_INDEX]: number,
    remove: () => void
}

interface Component {
    nodeName: string,
    namespaceURI?: string,
    attrs: Attrs,
    children: Child[],
    render: (container?: HTMLNode) => HTMLNode,
    toString: () => string
}

interface ChildrenAddable {
    (...children: Child[]): Component
}

/**
 * seems better to overload interface like below, but in that case,
 * the module doesn't recognize AbbrAttrChildrenAddable as a function but as an exported variable,
 * so better in auto-completion but worse in IDE readability
 * (usually displayed in the most IDE in different color from HTML tags).
 * I choose readability for now, but it can be changed in the future.
 *
<code>
    interface AttrChildrenAddable extends ChildrenAddable {
        (attrs: Attrs): ChildrenAddable & Component;
    }

    interface AbbrAttrChildrenAddable {
        (abbrebiation: any, ...variables: any[]): ChildrenAddable & Component;
        (abbrebiation: TemplateStringsArray, ...variables: any[]): ChildrenAddable & Component;
        (...children: Child[]): Component
    }
</code>
*/
interface AbbrAttrChildrenAddable {
    (attrs: Attrs | TemplateStringsArray | Child, ...children:Child[]): ChildrenAddable & Component;
}

const normalizeToComponent = (child: Child) => {
    if (child == null || typeof child === 'boolean') return rawComponent('#text')('');
    if (typeof child === 'string' || typeof child === 'number') return rawComponent('#text')(child + '');
    return child
};

const updateAttrs = (container: Element, attrs: Attrs) => {
    const existingAttrNames = container.getAttributeNames().sort();

    Object
        .entries(attrs)
        .sort(([key1], [key2]) => key1.localeCompare(key2))
        .concat([["", null]]) // add sentinel for one iteration at least
        .forEach(([key, value]) => {
            const onSomethingKeyExists = key.match(/(?<=^on)[A-Z].*$/);

            if (onSomethingKeyExists) {
                if (typeof value === 'function') {
                    container.addEventListener(onSomethingKeyExists[0].toLowerCase(), value)
                } else if (value.listener) {
                    container.addEventListener(onSomethingKeyExists[0].toLowerCase(), value.listener, value.options)
                }
                return
            }

            if (key === 'style' && typeof value !== 'string') {
                value = toStyleString(value)
            }

            if (key === 'class' && Array.isArray(value)) {
                value = value.join(' ')
            }

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

const isHTMLNode = (node: ChildNode): node is HTMLNode => node instanceof Element || node instanceof Text;

const groupByIndexAttr = (oldChildren: HTMLNode[]) => oldChildren
    .reduce((arr: HTMLNode[][], oldChild) => {
        const currentIndex = isDognutNode(oldChild) ? oldChild[CHILD_INDEX] : arr.length;
        if (arr[currentIndex] == null) arr[currentIndex] = [];
        arr[currentIndex].push(oldChild);
        return arr
    }, []);

const updateChildren = (container: Element, newChildrenGroup: any[]) => {
    const oldChildren = Array.from(container.childNodes)
        .filter(node => isHTMLNode(node))
        .map(htmlNode => htmlNode as HTMLNode);

    const oldChildrenGroupedByIndex = groupByIndexAttr(oldChildren);

    newChildrenGroup
        .forEach((newChildren, groupIndex) => {
            try {
                const flattenedNewChildren = flatten(newChildren);
                const assignedOldChildGroup = oldChildrenGroupedByIndex[groupIndex];

                flattenedNewChildren
                    .reduce((prevElement, newChild, index): DognutNode => {
                        try {
                            const childComponent = normalizeToComponent(newChild);
                            const assignedOldChild = assignedOldChildGroup && assignedOldChildGroup[index];
                            const rendered = applyComponent(container, assignedOldChild, prevElement, childComponent);
                            return Object.assign(rendered, {
                                [CHILD_INDEX]: groupIndex
                            })
                        } catch (e) {
                            throw Object.assign(e, {childIndex: index});
                        }
                    }, null)
            } catch (e) {
                const message = `error at child#${groupIndex}${newChildrenGroup.length > 1 && e.childIndex != null ? `[${e.childIndex}]` : ''}: ${e.depth == null ? '\n' : ''}${e.message}`;
                throw Object.assign(new Error(message), {
                    depth: e.depth,
                    stack: e.stack,
                });
            }
        });

    const oldChildrenLeftUnmatched: HTMLNode[][] = oldChildrenGroupedByIndex.slice(newChildrenGroup.length);
    flatten(oldChildrenLeftUnmatched).forEach(childNode => childNode.remove())
};

const createComponent = (nodeName: string, namespaceURI?: string, attrs?: Attrs, children?: Child[]): Component => {
    return {
        nodeName,
        namespaceURI,
        attrs: attrs || {},
        children: children || [],
        toString() {
            const idSelector = this.attrs.id ? '#' + this.attrs.id : '';
            var classSelector = (this.attrs.class || '')
                .split(/ +/)
                .filter((className: string) => className !== '')
                .map((className: string) => '.' + className)
                .join('');
            return this.nodeName + idSelector + classSelector
        },
        render(container) {
            try {
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
            } catch (e) {
                var indentedMessage = e.message
                    .split('\n')
                    .map((s: string) => '  ' + s)
                    .join('\n')
                    .slice(2);
                throw Object.assign(new Error(`\n${this} ${indentedMessage}`), {
                    depth: e.depth == null ? 0 : e.depth + 1,
                    stack: e.stack
                });
            }
        }
    }
};

const isTemplateLiteralArgs = (args: any) => Array.isArray(args[0]) && 'raw' in args[0];

const isChildrenArgs = (object: any[]) => {
    if (object[0] == null) return false; // noargs
    if (typeof object[0] === 'string') return true; // textNode
    if (typeof object[0].render === 'function') return true; // childComponent
    return false
};

const childrenSetterFor = (component: Component) => (...children: Child[]) =>
    createComponent(component.nodeName, component.namespaceURI, component.attrs, children);

const attrOrChildrenSetterFor = (component: Component) => (...args: any[]): any => {
    if (isChildrenArgs(args)) {
        return createComponent(component.nodeName, component.namespaceURI, {}, args);
    }
    if (isTemplateLiteralArgs(args)) {
        const attrsFromAbbr = parseAbbr(parseTemplate(args[0], ...args.slice(1)));
        const componentWithAttrs = createComponent(component.nodeName, component.namespaceURI, attrsFromAbbr, []);
        return Object.assign(childrenSetterFor(componentWithAttrs), componentWithAttrs);
    }
    // args is Attr or none
    const componentWithAttrs = createComponent(component.nodeName, component.namespaceURI, args[0], []);
    return decorate(childrenSetterFor(componentWithAttrs), componentWithAttrs);
};

const decorate = <T, U>(original: T, decorator: U): U & T => Object.assign(original, decorator);

const rawComponent: RawComponentFactory = (nodeName, namespaceURI) => {
    const component: Component = createComponent(nodeName, namespaceURI);
    return decorate(attrOrChildrenSetterFor(component), component);
};

export {CHILD_INDEX, rawComponent}
export {Child, Attrs, HTMLNode, DognutNode, ChildrenAddable, AbbrAttrChildrenAddable, Component}
