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
var NO_OLD_NODE = Symbol('noOldNode');
var SAME_TYPE = Symbol('sameType');
var DIFFERENT_TYPE = Symbol('differentType');
var normalizeToComponent = function (child) {
    if (typeof child === 'string')
        return textNode()(child);
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
        return NO_OLD_NODE;
    if (nodeName.toUpperCase() === node.nodeName.toUpperCase())
        return SAME_TYPE;
    return DIFFERENT_TYPE;
};
var applyComponent = function (container, targetElement, prevElement, childComponent) {
    var compareResult = compareNodeType(targetElement, childComponent.nodeName);
    if (compareResult === SAME_TYPE) {
        return childComponent.render(targetElement);
    }
    if (compareResult === DIFFERENT_TYPE) {
        var renderedElement = childComponent.render();
        container.insertBefore(renderedElement, targetElement);
        targetElement.remove();
        return renderedElement;
    }
    if (compareResult === NO_OLD_NODE) {
        var renderedElement = childComponent.render();
        var nextSibling = prevElement && prevElement.nextSibling;
        if (nextSibling) {
            container.insertBefore(renderedElement, nextSibling);
        }
        else {
            container.appendChild(renderedElement);
        }
        return renderedElement;
    }
};
var groupByIndexAttr = function (oldChildren) { return oldChildren
    .reduce(function (arr, oldChild) {
    var currentIndex = oldChild[CHILD_INDEX] || arr.length;
    if (arr[currentIndex] == null)
        arr[currentIndex] = [];
    arr[currentIndex].push(oldChild);
    return arr;
}, []); };
var updateChildren = function (container, newChildrenGroup) {
    var oldChildren = Array.from(container.childNodes);
    var oldChildrenGroupedByIndex = groupByIndexAttr(oldChildren);
    newChildrenGroup
        .forEach(function (newChildren, groupIndex) {
        var flattenedNewChildren = common_1.flatten(newChildren);
        var assignedOldChildGroup = oldChildrenGroupedByIndex[groupIndex];
        flattenedNewChildren
            .reduce(function (prevElement, newChild, index) {
            var childComponent = normalizeToComponent(newChild);
            var assignedOldChild = assignedOldChildGroup && assignedOldChildGroup[index];
            var rendered = applyComponent(container, assignedOldChild, prevElement, childComponent);
            rendered[CHILD_INDEX] = groupIndex;
            return rendered;
        }, null);
    });
    var oldChildrenLeftUnmatched = oldChildrenGroupedByIndex.slice(newChildrenGroup.length);
    common_1.flatten(oldChildrenLeftUnmatched).forEach(function (childNode) { return childNode.remove(); });
};
var _rawComponent = function (nodeName, namespaceURI, attrs, children) {
    if (attrs === void 0) { attrs = {}; }
    if (children === void 0) { children = []; }
    return {
        nodeName: nodeName,
        namespaceURI: namespaceURI,
        attrs: attrs,
        children: children,
        render: function (container) {
            if (!container) {
                container = (this.namespaceURI && document.createElementNS)
                    ? document.createElementNS(this.namespaceURI, this.nodeName)
                    : this.nodeName === '#text'
                        ? document.createTextNode(this.children[0])
                        : document.createElement(this.nodeName);
            }
            if (compareNodeType(container, this.nodeName) !== SAME_TYPE) {
                throw new Error('container type is not match with given one');
            }
            if (this.nodeName !== '#text') {
                updateAttrs(container, this.attrs);
                updateChildren(container, this.children);
            }
            else if (container.nodeValue !== this.children[0]) {
                container.nodeValue = this.children[0];
            }
            return container;
        }
    };
};
var isChildrenArgs = function (args) {
    if (args[0] == null)
        return false; // noargs
    if (typeof args[0] === 'string')
        return true; // textNode
    if (typeof args[0].render === 'function')
        return true; // childComponent
    return false;
};
var isTemplateLiteralArgs = function (args) {
    return Array.isArray(args[0]) && args[0]['raw'] != null;
};
var initWithNodeNameAndAttrs = function (nodeName, namespaceURI, attrs) { return function () {
    var children = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        children[_i] = arguments[_i];
    }
    return _rawComponent(nodeName, namespaceURI, attrs, children);
}; };
var initWithNodeName = function (nodeName, namespaceURI) { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (isChildrenArgs(args)) {
        return _rawComponent(nodeName, namespaceURI, {}, args);
    }
    var attrs = isTemplateLiteralArgs(args) ? common_1.parseAbbr(common_1.parseTemplate.apply(void 0, __spreadArrays([args[0]], args.slice(1)))) : args[0];
    return Object.assign(initWithNodeNameAndAttrs(nodeName, namespaceURI, attrs), _rawComponent(nodeName, namespaceURI, attrs));
}; };
var init = function (nodeName, namespaceURI) { return Object.assign(initWithNodeName(nodeName, namespaceURI), _rawComponent(nodeName, namespaceURI)); };
exports.rawComponent = init;
var textNode = init('#text');
//# sourceMappingURL=RawComponent.js.map