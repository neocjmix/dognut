import {Component, HTMLNode} from "./RawComponent";

type UpdateFunction = () => HTMLNode;
type RenderOptions = { isUpdate?: Boolean };
type ComponentResolver = () => Component;
type UpdatableComponentResolverFactory = (props: Object, update: UpdateFunction) => ComponentResolver;

export const updatable = (createUpdatableComponentResolver: UpdatableComponentResolverFactory) => (props: Object) => {
    let previousRenderedContainer: HTMLNode;
    let memorizedComponent: Component;

    const componentFactory = createUpdatableComponentResolver(props, () => render(undefined, {isUpdate: true}));

    const render = (container: HTMLNode = previousRenderedContainer, options: RenderOptions = {}) => {
        if (previousRenderedContainer == null || options.isUpdate) {
            memorizedComponent = componentFactory();
            previousRenderedContainer = memorizedComponent.render(container);
        }
        return previousRenderedContainer
    };

    return {render}
};
