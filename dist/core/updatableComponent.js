"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatable = function (createComponent) { return function (props) {
    var view = createComponent(props, function () { return update(); });
    var _container;
    var update = function (container) {
        if (container === void 0) { container = _container; }
        _container = view().render(container);
        return _container;
    };
    return { render: update };
}; };
//# sourceMappingURL=updatableComponent.js.map