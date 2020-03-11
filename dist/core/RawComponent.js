"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var CHILD_INDEX = Symbol('childIndex');
exports.CHILD_INDEX = CHILD_INDEX;
var nodeCompareResult;
(function (nodeCompareResult) {
    nodeCompareResult[nodeCompareResult["NO_OLD_NODE"] = 0] = "NO_OLD_NODE";
    nodeCompareResult[nodeCompareResult["SAME_TYPE"] = 1] = "SAME_TYPE";
    nodeCompareResult[nodeCompareResult["DIFFERENT_TYPE"] = 2] = "DIFFERENT_TYPE";
})(nodeCompareResult || (nodeCompareResult = {}));
var normalizeToComponent = function (child) {
    if (child == null || typeof child === 'boolean')
        return rawComponent('#text')('');
    if (typeof child === 'string' || typeof child === 'number')
        return rawComponent('#text')(child + '');
    return child;
};
var updateAttrs = function (container, attrs) {
    var existingAttrNames = container.getAttributeNames().sort();
    Object
        .entries(attrs)
        .sort(function (_a, _b) {
        var key1 = _a[0];
        var key2 = _b[0];
        return key1.localeCompare(key2);
    })
        .concat([["", null]]) // add sentinel for one iteration at least
        .forEach(function (_a) {
        var key = _a[0], value = _a[1];
        //remove existing Attribute that is not in new Attrs
        while (existingAttrNames[0] && existingAttrNames[0] !== key) {
            container.removeAttribute(existingAttrNames[0]);
            existingAttrNames.shift(); // todo: check performance and consider using index variable or [].pop()
        }
        if (key !== "") {
            container.setAttribute(key, value.toString());
            existingAttrNames.shift();
        }
    });
};
var compareNodeType = function (node, nodeName) {
    if (node == null)
        return nodeCompareResult.NO_OLD_NODE;
    if (nodeName.toUpperCase() === node.nodeName.toUpperCase())
        return nodeCompareResult.SAME_TYPE;
    return nodeCompareResult.DIFFERENT_TYPE;
};
var applyComponent = function (containerElement, targetElement, prevNode, childComponent) {
    switch (compareNodeType(targetElement, childComponent.nodeName)) {
        case nodeCompareResult.SAME_TYPE:
            return childComponent.render(targetElement);
        case nodeCompareResult.DIFFERENT_TYPE:
            var renderedElement1 = childComponent.render();
            containerElement.insertBefore(renderedElement1, targetElement);
            targetElement.remove();
            return renderedElement1;
        case nodeCompareResult.NO_OLD_NODE:
            var renderedElement2 = childComponent.render();
            var nextSibling = prevNode && prevNode.nextSibling;
            if (nextSibling) {
                containerElement.insertBefore(renderedElement2, nextSibling);
            }
            else {
                containerElement.appendChild(renderedElement2);
            }
            return renderedElement2;
        default:
            throw new Error("should not reach here");
    }
};
var isDognutNode = function (node) { return CHILD_INDEX in node; };
var groupByIndexAttr = function (oldChildren) { return oldChildren
    .reduce(function (arr, oldChild) {
    var currentIndex = isDognutNode(oldChild) ? oldChild[CHILD_INDEX] : arr.length;
    if (arr[currentIndex] == null)
        arr[currentIndex] = [];
    arr[currentIndex].push(oldChild);
    return arr;
}, []); };
var isHTMLNode = function (node) { return node instanceof Element || node instanceof Text; };
var updateChildren = function (container, newChildrenGroup) {
    var oldChildren = Array.from(container.childNodes)
        .filter(function (node) { return isHTMLNode(node); })
        .map(function (htmlNode) { return htmlNode; });
    var oldChildrenGroupedByIndex = groupByIndexAttr(oldChildren);
    newChildrenGroup
        .forEach(function (newChildren, groupIndex) {
        try {
            var flattenedNewChildren = common_1.flatten(newChildren);
            var assignedOldChildGroup_1 = oldChildrenGroupedByIndex[groupIndex];
            flattenedNewChildren
                .reduce(function (prevElement, newChild, index) {
                var _a;
                try {
                    var childComponent = normalizeToComponent(newChild);
                    var assignedOldChild = assignedOldChildGroup_1 && assignedOldChildGroup_1[index];
                    var rendered = applyComponent(container, assignedOldChild, prevElement, childComponent);
                    return Object.assign(rendered, (_a = {},
                        _a[CHILD_INDEX] = groupIndex,
                        _a));
                }
                catch (e) {
                    throw Object.assign(e, { childIndex: index });
                }
            }, null);
        }
        catch (e) {
            throw Object.assign(new Error("error at child#" + groupIndex + (newChildrenGroup.length > 1 && e.childIndex != null ? "[" + e.childIndex + "]" : '') + ": " + (e.depth == null ? '\n' : '') + e.message), {
                depth: e.depth
            });
        }
    });
    var oldChildrenLeftUnmatched = oldChildrenGroupedByIndex.slice(newChildrenGroup.length);
    common_1.flatten(oldChildrenLeftUnmatched).forEach(function (childNode) { return childNode.remove(); });
};
var createComponent = function (nodeName, namespaceURI, attrs, children) {
    return {
        nodeName: nodeName,
        namespaceURI: namespaceURI,
        attrs: attrs || {},
        children: children || [],
        toString: function () {
            var idSelector = this.attrs.id ? '#' + this.attrs.id : '';
            var classSelector = (this.attrs.class || '')
                .split(/ +/)
                .filter(function (className) { return className !== ''; })
                .map(function (className) { return '.' + className; })
                .join('');
            return this.nodeName + idSelector + classSelector;
        },
        render: function (container) {
            try {
                if (!container) {
                    if (this.namespaceURI && document.createElementNS) {
                        container = document.createElementNS(this.namespaceURI, this.nodeName);
                    }
                    else {
                        if (this.nodeName === '#text') {
                            if (typeof this.children[0] !== 'string') {
                                throw new Error('content of textnode should be string.');
                            }
                            container = document.createTextNode(this.children[0]);
                        }
                        else {
                            container = document.createElement(this.nodeName);
                        }
                    }
                }
                if (compareNodeType(container, this.nodeName) !== nodeCompareResult.SAME_TYPE) {
                    throw new Error('container type is not match with given one');
                }
                if (container instanceof Element) {
                    updateAttrs(container, this.attrs);
                    updateChildren(container, this.children);
                }
                if (container instanceof Text && container.nodeValue !== this.children[0]) {
                    if (typeof this.children[0] !== 'string') {
                        throw new Error('content of textnode should be string.');
                    }
                    container.nodeValue = this.children[0];
                }
                return container;
            }
            catch (e) {
                var indentedMessage = e.message
                    .split('\n')
                    .map(function (s) { return '  ' + s; })
                    .join('\n')
                    .slice(2);
                throw Object.assign(new Error("\n" + this + " " + indentedMessage), {
                    depth: e.depth == null ? 0 : e.depth + 1
                });
            }
        }
    };
};
var isTemplateLiteralArgs = function (args) { return Array.isArray(args[0]) && 'raw' in args[0]; };
var isChildrenArgs = function (object) {
    if (object[0] == null)
        return false; // noargs
    if (typeof object[0] === 'string')
        return true; // textNode
    if (typeof object[0].render === 'function')
        return true; // childComponent
    return false;
};
var childrenSetterFor = function (component) { return function () {
    var children = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        children[_i] = arguments[_i];
    }
    return createComponent(component.nodeName, component.namespaceURI, component.attrs, children);
}; };
var attrOrChildrenSetterFor = function (component) { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (isChildrenArgs(args)) {
        return createComponent(component.nodeName, component.namespaceURI, {}, args);
    }
    if (isTemplateLiteralArgs(args)) {
        var attrsFromAbbr = common_1.parseAbbr(common_1.parseTemplate.apply(void 0, __spreadArrays([args[0]], args.slice(1))));
        var componentWithAttrs_1 = createComponent(component.nodeName, component.namespaceURI, attrsFromAbbr, []);
        return Object.assign(childrenSetterFor(componentWithAttrs_1), componentWithAttrs_1);
    }
    // args is Attr or none
    var componentWithAttrs = createComponent(component.nodeName, component.namespaceURI, args[0], []);
    return decorate(childrenSetterFor(componentWithAttrs), componentWithAttrs);
}; };
var decorate = function (original, decorator) { return Object.assign(original, decorator); };
var rawComponent = function (nodeName, namespaceURI) {
    var component = createComponent(nodeName, namespaceURI);
    return decorate(attrOrChildrenSetterFor(component), component);
};
exports.rawComponent = rawComponent;
//# sourceMappingURL=RawComponent.js.map