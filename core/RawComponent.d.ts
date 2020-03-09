declare const CHILD_INDEX: unique symbol;
declare type Child = Component | string;
declare type Attrs = object;
declare type HTMLNode = Element | Text;
interface DognutNode extends Node {
    [CHILD_INDEX]: number;
    remove: () => void;
}
interface ComponentWithoutAttrAndChildren extends Function, Component {
    (...children: Child[]): Component;
    (attrs: Attrs): ComponentWithAttrs;
    (abbrebiation: TemplateStringsArray, ...variables: any[]): ComponentWithAttrs;
}
interface ComponentWithAttrs extends Function, Component {
    (...children: Child[]): Component;
}
interface Component {
    nodeName: string;
    namespaceURI?: string;
    attrs: object;
    children: (Component | string)[];
    render: (container?: HTMLNode) => HTMLNode;
}
declare const init: (nodeName: string, namespaceURI?: string | undefined) => ComponentWithoutAttrAndChildren;
export { init as rawComponent, CHILD_INDEX, DognutNode, ComponentWithoutAttrAndChildren, ComponentWithAttrs, Component, Child, Attrs, HTMLNode };
