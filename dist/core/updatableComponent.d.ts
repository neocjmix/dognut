import { Component, HTMLNode } from "./RawComponent";
declare type RenderFunction = () => HTMLNode;
declare type UpdatableComponentFactory = (props: Object, update: RenderFunction) => () => Component;
export declare const updatable: (createComponent: UpdatableComponentFactory) => (props: Object) => {
    render: (container?: HTMLNode) => HTMLNode;
};
export {};
