(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.React = {})));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var ReactElement = /** @class */ (function () {
        function ReactElement(tagName, props) {
            var children = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                children[_i - 2] = arguments[_i];
            }
            this.tagName = tagName;
            this.props = {};
            this.children = children;
            var arrChildren = [];
            var allProps = {};
            if (Array.isArray(this.children)) {
                for (var i = 0, len = this.children.length; i < len; i++) {
                    var child = this.children[i];
                    if (typeof child === "number") {
                        this.children[i] = child + '';
                    }
                    if (Array.isArray(child)) {
                        arrChildren = arrChildren.concat(child);
                    }
                    else {
                        arrChildren.push(child);
                    }
                }
            }
            // Object.assign(this.props, props);
            this.children = arrChildren;
            if (arrChildren.length > 0) {
                Object.assign(this.props, {
                    children: arrChildren
                });
            }
            if (isReactComponent(tagName) && tagName.defaultProps) {
                Object.assign(allProps, tagName.defaultProps, props);
            }
            else {
                Object.assign(allProps, props);
            }
            if (allProps) {
                if (allProps.key) {
                    this.key = allProps.key + "";
                    // delete allProps.key;
                }
                if (typeof allProps.ref === "function") {
                    this.ref = allProps.ref;
                    // delete allProps.ref;
                }
            }
            Object.assign(this.props, allProps);
        }
        return ReactElement;
    }());
    function isReactComponent(tagName) {
        return typeof tagName === "function";
    }
    function cloneElement(element, config) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        var props = element.props;
        var newConfig = Object.assign({}, props);
        if (config.key) {
            newConfig.key = config.key + '';
        }
        if (typeof config.ref === 'function') {
            newConfig.ref = config.ref;
        }
        Object.assign(newConfig, config);
        return new (ReactElement.bind.apply(ReactElement, [void 0, element.tagName, newConfig].concat(children)))();
    }

    /**
     * Diff two list in O(N).
     * @param {Array} oldList - Original List
     * @param {Array} newList - List After certain insertions, removes, or moves
     * @return {Object} - {moves: <Array>}
     *                  - moves is a list of actions that telling how to remove and insert
     */

    // var diff = require("list-diff2");
    var ChangeType;
    (function (ChangeType) {
        ChangeType[ChangeType["REPLACE"] = 0] = "REPLACE";
        ChangeType[ChangeType["REORDER"] = 1] = "REORDER";
        ChangeType[ChangeType["PROPS"] = 2] = "PROPS";
        ChangeType[ChangeType["TEXT"] = 3] = "TEXT";
    })(ChangeType || (ChangeType = {}));
    var MoveType;
    (function (MoveType) {
        MoveType[MoveType["REMOVE"] = 0] = "REMOVE";
        MoveType[MoveType["INSERT"] = 1] = "INSERT";
    })(MoveType || (MoveType = {}));

    var instMapCompositeComponent = new Map();
    var CompositeType;
    (function (CompositeType) {
        CompositeType[CompositeType["ReactComponent"] = 0] = "ReactComponent";
        CompositeType[CompositeType["StateLessComponent"] = 1] = "StateLessComponent";
        CompositeType[CompositeType["PureComponent"] = 2] = "PureComponent";
    })(CompositeType || (CompositeType = {}));

    var ReactComponent = /** @class */ (function () {
        function ReactComponent(props, context) {
            this.props = props;
            this.context = context;
        }
        ReactComponent.prototype.setState = function (partState, cb) {
            var internalInstance = instMapCompositeComponent.get(this);
            if (internalInstance) {
                internalInstance._peddingState = internalInstance._peddingState || [];
                internalInstance._peddingState.push(partState);
                internalInstance.receiveComponent();
                cb && cb();
            }
        };
        ReactComponent.prototype.forceUpdate = function (cb) {
            var internalInstance = instMapCompositeComponent.get(this);
            if (internalInstance) {
                internalInstance.receiveComponent();
                cb && cb();
            }
        };
        ReactComponent.isReactComponent = true;
        return ReactComponent;
    }());
    ReactComponent.prototype.isReactComponent = {};
    var ReactPureComponent = /** @class */ (function (_super) {
        __extends(ReactPureComponent, _super);
        function ReactPureComponent(props, context) {
            return _super.call(this, props, context) || this;
        }
        ReactPureComponent.isReactPureComponent = true;
        return ReactPureComponent;
    }(ReactComponent));

    var Children = {
        count: function (children) {
            return children.length;
        },
        only: function (children) {
            if (children.length === 1) {
                return children[0];
            }
            else {
                throw new Error("Not the only child");
            }
        },
        forEach: function (children, fn) {
            if (Array.isArray(children)) {
                return children.forEach(fn);
            }
        },
        map: function (children, fn) {
            return children.map(fn);
        },
        toArray: function (children) {
            return children;
        }
    };

    var Component = ReactComponent;
    var PureComponent = ReactPureComponent;
    function createElement(tagName, props) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        return new (ReactElement.bind.apply(ReactElement, [void 0, tagName, props].concat(children)))();
    }
    var React = {
        createElement: createElement,
        Component: ReactComponent,
        PureComponent: ReactPureComponent,
        Children: Children,
        cloneElement: cloneElement,
        isValidElement: function (child) {
            return child instanceof ReactElement;
        }
    };

    exports.Component = Component;
    exports.PureComponent = PureComponent;
    exports.Children = Children;
    exports.createElement = createElement;
    exports.default = React;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
