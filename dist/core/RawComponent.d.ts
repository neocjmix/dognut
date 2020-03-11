declare const CHILD_INDEX: unique symbol;
declare type Child = Component | string;
declare type Attrs = {
    [key: string]: any;
};
declare type HTMLNode = Element | Text;
declare type RawComponentFactory = (nodeName: string, namespaceURI?: string) => AbbrAttrChildrenAddable & Component;
interface DognutNode extends Node {
    [CHILD_INDEX]: number;
    remove: () => void;
}
interface Component {
    nodeName: string;
    namespaceURI?: string;
    attrs: object;
    children: (Component | string)[];
    render: (container?: HTMLNode) => HTMLNode;
}
interface ChildrenAddable {
    (...children: Child[]): Component;
}
interface AttrChildrenAddable extends ChildrenAddable {
    (attrs: Attrs): ChildrenAddable & Component;
}
interface AbbrAttrChildrenAddable extends AttrChildrenAddable {
    (abbrebiation: TemplateStringsArray, ...variables: any[]): ChildrenAddable & Component;
}
declare const rawComponent: RawComponentFactory;
export { CHILD_INDEX, rawComponent };
export { Child, Attrs, HTMLNode, DognutNode, ChildrenAddable, AbbrAttrChildrenAddable, Component };
