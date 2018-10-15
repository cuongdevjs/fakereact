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
    function isReactElement(ele) {
        return typeof ele !== "string";
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
    function diff (oldList, newList, key) {
        var oldMap = makeKeyIndexAndFree(oldList, key);
        var newMap = makeKeyIndexAndFree(newList, key);
      
        var newFree = newMap.free;
      
        var oldKeyIndex = oldMap.keyIndex;
        var newKeyIndex = newMap.keyIndex;
      
        var moves = [];
      
        // a simulate list to manipulate
        var children = [];
        var i = 0;
        var item;
        var itemKey;
        var freeIndex = 0;
      
        // fist pass to check item in old list: if it's removed or not
        while (i < oldList.length) {
          item = oldList[i];
          itemKey = getItemKey(item, key);
          if (itemKey) {
            if (!newKeyIndex.hasOwnProperty(itemKey)) {
              children.push(null);
            } else {
              var newItemIndex = newKeyIndex[itemKey];
              children.push(newList[newItemIndex]);
            }
          } else {
            var freeItem = newFree[freeIndex++];
            children.push(freeItem || null);
          }
          i++;
        }
      
        var simulateList = children.slice(0);
      
        // remove items no longer exist
        i = 0;
        while (i < simulateList.length) {
          if (simulateList[i] === null) {
            remove(i);
            removeSimulate(i);
          } else {
            i++;
          }
        }
      
        // i is cursor pointing to a item in new list
        // j is cursor pointing to a item in simulateList
        var j = i = 0;
        while (i < newList.length) {
          item = newList[i];
          itemKey = getItemKey(item, key);
      
          var simulateItem = simulateList[j];
          var simulateItemKey = getItemKey(simulateItem, key);
      
          if (simulateItem) {
            if (itemKey === simulateItemKey) {
              j++;
            } else {
              // new item, just inesrt it
              if (!oldKeyIndex.hasOwnProperty(itemKey)) {
                insert(i, item);
              } else {
                // if remove current simulateItem make item in right place
                // then just remove it
                var nextItemKey = getItemKey(simulateList[j + 1], key);
                if (nextItemKey === itemKey) {
                  remove(i);
                  removeSimulate(j);
                  j++; // after removing, current j is right, just jump to next one
                } else {
                  // else insert item
                  insert(i, item);
                }
              }
            }
          } else {
            insert(i, item);
          }
      
          i++;
        }
      
        function remove (index) {
          var move = {index: index, type: 0};
          moves.push(move);
        }
      
        function insert (index, item) {
          var move = {index: index, item: item, type: 1};
          moves.push(move);
        }
      
        function removeSimulate (index) {
          simulateList.splice(index, 1);
        }
      
        return {
          moves: moves,
          children: children
        }
      }
      
      /**
       * Convert list to key-item keyIndex object.
       * @param {Array} list
       * @param {String|Function} key
       */
      function makeKeyIndexAndFree (list, key) {
        var keyIndex = {};
        var free = [];
        for (var i = 0, len = list.length; i < len; i++) {
          var item = list[i];
          var itemKey = getItemKey(item, key);
          if (itemKey) {
            keyIndex[itemKey] = i;
          } else {
            free.push(item);
          }
        }
        return {
          keyIndex: keyIndex,
          free: free
        }
      }
      
      function getItemKey (item, key) {
        if (!item || !key) return void 666
        return typeof key === 'string'
          ? item[key]
          : key(item)
      }

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
    /*
    interface IdiffPatch {
        [index: number]: Array<IChange>;
    }

    function isStringNode(node: ReactNode): node is string {
        return typeof(node) === "string";
    }
    */
    function diffProps(oldNode, newNode) {
        var count = 0;
        var oldProps = oldNode.props;
        var newProps = newNode.props;
        var key;
        var propsPatches = {};
        // todo 两次for in 循环是否有优化空间
        for (key in oldProps) {
            if (key !== "children") {
                var oldVal = oldProps[key];
                var newVal = newProps[key];
                if (oldVal !== newVal) {
                    count++;
                    propsPatches[key] = newVal;
                }
            }
        }
        for (key in newProps) {
            if (key !== "children") {
                if (!oldProps.hasOwnProperty(key)) {
                    count++;
                    propsPatches[key] = newProps[key];
                }
            }
        }
        return count === 0 ? null : propsPatches;
    }
    function diffChildren(oldChildren, newChildren, currentPatch) {
        var diffs = diff(oldChildren, newChildren, "key");
        newChildren = diffs.children;
        if (Array.isArray(diffs.moves)) {
            var reorderPatch = {
                type: ChangeType.REORDER,
                moves: diffs.moves,
                children: newChildren,
            };
            currentPatch.push(reorderPatch);
        }
    }
    function dfsWalk(oldNode, newNode) {
        var currentPatch = [];
        if (!newNode) ;
        else if ((typeof oldNode === "string" || typeof oldNode === "number") && (typeof newNode === "string" || typeof newNode === "number")) {
            if (oldNode !== newNode) {
                var nodeChange = {
                    type: ChangeType.TEXT,
                    content: newNode
                };
                currentPatch.push(nodeChange);
            }
        }
        else if (isReactElement(oldNode) && isReactElement(newNode)) {
            if (oldNode.tagName === newNode.tagName) {
                // 节点未变化
                // 查看属性变更
                var propsPatches = diffProps(oldNode, newNode);
                propsPatches && currentPatch.push({
                    type: ChangeType.PROPS,
                    props: propsPatches,
                });
                diffChildren(oldNode.children, newNode.children, currentPatch);
            }
            else {
                currentPatch.push({
                    type: ChangeType.REPLACE,
                    node: newNode,
                });
            }
        }
        else {
            currentPatch.push({
                type: ChangeType.REPLACE,
            });
        }
        return currentPatch;
    }

    function transformToCssKey(key) {
        return key.replace(/[A-Z]/g, function (a, b) {
            console.log(a, b);
            return "-" + a.toLowerCase();
        });
    }

    function isAttachEvent(key) {
        if (key.substring(0, 2) === "on") {
            return true;
        }
        return false;
    }
    function isPropsChildren(key) {
        return key === "children";
    }
    var ReactDOMComponent = /** @class */ (function () {
        function ReactDOMComponent(ele, container) {
            this._currentElement = ele;
            this._container = container;
        }
        ReactDOMComponent.prototype.mountComponent = function (context, replaceElement, isInsert) {
            this._context = context;
            if (this._currentElement instanceof ReactElement) {
                var props = this._currentElement.props;
                var tagName = this._currentElement.tagName;
                var el = document.createElement(tagName);
                this.updateProps(el, props);
                this._renderElement = el;
                this.mountIntoDom(replaceElement, isInsert);
                if (props && Array.isArray(props.children)) {
                    this.mountChildComponent(props.children, el);
                }
                var ref = this._currentElement.ref;
                if (ref) {
                    this._ref = ref;
                    ref(this._renderElement);
                }
            }
            else if (!!this._currentElement || this._currentElement === 0) {
                var textNode = document.createTextNode(this._currentElement + '');
                this._renderElement = textNode;
                this.mountIntoDom(replaceElement, isInsert);
            }
            else {
                var commentNode = document.createComment("Empty Node");
                this._renderElement = commentNode;
                this.mountIntoDom(replaceElement, isInsert);
            }
        };
        ReactDOMComponent.prototype.mountIntoDom = function (replaceNode, isInsert) {
            if (replaceNode !== undefined) {
                // let replaceNode: Node = this._container.childNodes[replaceIndex];
                if (isInsert) {
                    this._container.insertBefore(this._renderElement, replaceNode);
                }
                else {
                    this._container.replaceChild(this._renderElement, replaceNode);
                }
            }
            else {
                this._container.appendChild(this._renderElement);
            }
        };
        ReactDOMComponent.prototype.mountChildComponent = function (children, container) {
            var _this = this;
            children.forEach(function (child, index) {
                if (Array.isArray(child)) {
                    _this.mountChildComponent(child, container);
                }
                else {
                    var renderComponent = ReactReconciler.initialComponent(child, container);
                    if (!_this._renderChildComponent) {
                        _this._renderChildComponent = [];
                    }
                    _this._renderChildComponent.push(renderComponent);
                    renderComponent.mountComponent(_this._context);
                }
            });
        };
        ReactDOMComponent.prototype.receiveComponent = function (nextElement, nextContext) {
            this._context = nextContext;
            this.updateComponent(this._currentElement, nextElement);
        };
        ReactDOMComponent.prototype.updateComponent = function (prevElement, nextElement) {
            var changes = dfsWalk(prevElement, nextElement);
            if (changes.length > 0) {
                this.updateDomElement(changes);
                this._ref && this._ref(this._renderElement);
            }
            this._currentElement = nextElement;
        };
        ReactDOMComponent.prototype.updateChildComponent = function (children) {
            var _this = this;
            children.forEach(function (child, index) {
                if (Array.isArray(child)) {
                    _this.updateChildComponent(child);
                    index = index + child.length;
                }
                else if (_this._renderChildComponent && _this._renderChildComponent[index]) {
                    var prevInstance = _this._renderChildComponent[index];
                    var prevElement = prevInstance._currentElement;
                    if (ReactReconciler.shouldUpdateReactComponent(prevElement, child)) {
                        ReactReconciler.receiveComponent(prevInstance, child, _this._context);
                    }
                    else {
                        // prevInstance.unmountComponent();
                        var nextContainer = void 0;
                        if (_this._renderElement instanceof HTMLElement) {
                            nextContainer = _this._renderElement;
                        }
                        else {
                            nextContainer = _this._container;
                        }
                        _this._renderChildComponent[index] = ReactReconciler.initialComponent(child, nextContainer);
                        var hostNode = ReactReconciler.getHostNode(prevInstance);
                        _this._renderChildComponent[index].mountComponent({}, hostNode);
                        prevInstance.unmountComponent();
                    }
                }
                else {
                    if (_this._renderElement instanceof HTMLElement) {
                        if (child || child === 0) {
                            _this._renderChildComponent[index] = ReactReconciler.initialComponent(child, _this._renderElement);
                            _this._renderChildComponent[index].mountComponent(_this._context);
                        }
                    }
                }
            });
        };
        ReactDOMComponent.prototype.updateDomElement = function (changes) {
            var _this = this;
            changes.forEach(function (change, index) {
                var el = _this._renderElement;
                switch (change.type) {
                    case ChangeType.TEXT:
                        if (el.nodeValue && !!change.content) {
                            el.nodeValue = change.content + "";
                        }
                        break;
                    case ChangeType.PROPS:
                        if (el instanceof HTMLElement && !!change.props) {
                            _this.updateProps(el, change.props);
                        }
                        break;
                    case ChangeType.REPLACE:
                        _this.replaceNode(change.node);
                        break;
                    case ChangeType.REORDER:
                        if (change.children) {
                            _this.updateChildComponent(change.children);
                        }
                        if (change.moves) {
                            _this.applyMoves(change.moves);
                        }
                        break;
                }
            });
        };
        ReactDOMComponent.prototype.replaceNode = function (newNode) {
            if (newNode) {
                this._currentElement = newNode;
                var el = document.createElement(newNode.tagName);
                this.updateProps(el, newNode.props);
                this._eventListener && this._eventListener.clear();
                this._container.replaceChild(el, this._renderElement);
                this._renderElement = el;
                this._renderChildComponent = [];
            }
        };
        ReactDOMComponent.prototype.applyMoves = function (moves) {
            var _this = this;
            moves.forEach(function (move, index) { return _this.reorderNode(move); });
        };
        ReactDOMComponent.prototype.reorderNode = function (move) {
            if (move.type === MoveType.INSERT) {
                if (move.item) {
                    var container = void 0;
                    if (this._renderElement instanceof HTMLElement) {
                        container = this._renderElement;
                    }
                    else {
                        container = this._container;
                    }
                    var renderComponent = ReactReconciler.initialComponent(move.item, container);
                    if (this._renderChildComponent) {
                        this._renderChildComponent.splice(move.index, 0, renderComponent);
                        var hostNode = container.childNodes[move.index];
                        renderComponent.mountComponent(this._context, hostNode, true);
                    }
                    else {
                        this._renderChildComponent = [renderComponent];
                        renderComponent.mountComponent(this._context);
                    }
                }
            }
            else {
                this._renderChildComponent[move.index] && this._renderChildComponent[move.index].unmountComponent();
                var removeNode = this._renderElement.childNodes[move.index];
                this._renderElement.removeChild(removeNode);
            }
        };
        ReactDOMComponent.prototype.unmountComponent = function () {
            if (Array.isArray(this._renderChildComponent)) {
                this._renderChildComponent.forEach(function (child, index) {
                    ReactReconciler.unmountComponent(child);
                });
            }
            this._ref && this._ref(null);
            delete this._container;
            delete this._renderChildComponent;
            delete this._renderElement;
            delete this._eventListener;
            delete this._currentElement;
            delete this._ref;
        };
        ReactDOMComponent.prototype.updateProps = function (el, props) {
            var _loop_1 = function (key) {
                if (props[key] !== undefined) {
                    if (key === "className") {
                        el.setAttribute("class", props[key]);
                    }
                    else if (isAttachEvent(key)) {
                        this_1.attachEvent(el, key, props[key]);
                    }
                    else if (key === "ref" || isPropsChildren(key)) ;
                    else if (key === "value") {
                        el.setAttribute(key, props[key]);
                        if (this_1._currentElement instanceof ReactElement) {
                            if (this_1._currentElement.tagName === "input") {
                                this_1.attachEvent(el, "onInput");
                            }
                        }
                    }
                    else if (key === "style") {
                        var style_1 = props[key];
                        var keys = Object.keys(style_1);
                        var cssarr = keys.map(function (ele, index) {
                            var cssval = style_1[ele];
                            var csskey = transformToCssKey(ele);
                            return csskey + ": " + cssval;
                        });
                        cssarr.length && el.setAttribute("style", cssarr.join(";"));
                    }
                    else {
                        el.setAttribute(key, props[key]);
                    }
                }
            };
            var this_1 = this;
            for (var key in props) {
                _loop_1(key);
            }
        };
        ReactDOMComponent.prototype.attachEvent = function (el, key, val) {
            var eventName = key.substring(2).toLowerCase();
            var eventHandle;
            var that = this;
            if (el instanceof HTMLInputElement && (eventName === "input" || eventName === "change")) {
                eventName = "input";
                eventHandle = function (e) {
                    var value;
                    val && val(e);
                    if (that._currentElement instanceof ReactElement) {
                        value = that._currentElement.props.value;
                    }
                    switch (el.type) {
                        case "text":
                            el.value = value;
                            break;
                        case "checkbox":
                            el.checked = value;
                            break;
                        default:
                            el.value = value;
                    }
                };
            }
            else {
                eventHandle = function (e) {
                    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                    val && val(e);
                };
            }
            var oldEventListener;
            if (!this._eventListener) {
                this._eventListener = new Map();
            }
            if (this._eventListener.has(eventName)) {
                if (val) {
                    oldEventListener = this._eventListener.get(eventName) || eventHandle;
                    el.removeEventListener(eventName, oldEventListener);
                    this._eventListener.set(eventName, eventHandle);
                    el.addEventListener(eventName, eventHandle, false);
                }
            }
            else {
                this._eventListener.set(eventName, eventHandle);
                el.addEventListener(eventName, eventHandle, false);
            }
        };
        return ReactDOMComponent;
    }());

    var ReactReconciler = {
        initialComponent: function (element, container) {
            var internalInst;
            if (element instanceof ReactElement) {
                if (typeof element.tagName === "string") {
                    internalInst = new ReactDOMComponent(element, container);
                }
                else {
                    internalInst = new ReactCompositeComponent(element, container);
                }
            }
            else {
                internalInst = new ReactDOMComponent(element, container);
            }
            return internalInst;
        },
        receiveComponent: function (internalInstance, nextElement, nextContext) {
            if (nextElement instanceof ReactElement) {
                if (typeof nextElement.tagName === "string" && internalInstance instanceof ReactDOMComponent) {
                    internalInstance.receiveComponent(nextElement, nextContext);
                }
                else if (internalInstance instanceof ReactCompositeComponent) {
                    internalInstance.receiveComponent(nextElement, nextContext);
                }
                else {
                    throw new Error("element and component are not compatible");
                }
            }
            else if (internalInstance instanceof ReactDOMComponent) {
                internalInstance.receiveComponent(nextElement, nextContext);
            }
            else {
                throw new Error("element and component are not compatible");
            }
        },
        shouldUpdateReactComponent: function (prevRenderElement, nextRenderElement) {
            if (typeof prevRenderElement === "string" || typeof prevRenderElement === "number") {
                return typeof nextRenderElement === "string" || typeof prevRenderElement === "number";
            }
            else if (nextRenderElement instanceof ReactElement && prevRenderElement instanceof ReactElement) {
                return prevRenderElement.tagName === nextRenderElement.tagName && prevRenderElement.key === nextRenderElement.key;
            }
            else {
                return false;
            }
        },
        unmountComponent: function (internalInstance) {
            internalInstance.unmountComponent();
        },
        getHostNode: function (component) {
            if (component instanceof ReactDOMComponent) {
                return component._renderElement;
            }
            return this.getHostNode(component._renderComponent);
        }
    };

    function shallowEqual(objA, objB, compare, compareContext) {
        var ret = compare ? compare.call(compareContext, objA, objB) : void 0;
      
        if (ret !== void 0) {
          return !!ret;
        }
      
        if (objA === objB) {
          return true;
        }
      
        if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
          return false;
        }
      
        var keysA = Object.keys(objA);
        var keysB = Object.keys(objB);
      
        if (keysA.length !== keysB.length) {
          return false;
        }
      
        var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
      
        // Test for A's keys different from B.
        for (var idx = 0; idx < keysA.length; idx++) {
          var key = keysA[idx];
      
          if (!bHasOwnProperty(key)) {
            return false;
          }
      
          var valueA = objA[key];
          var valueB = objB[key];
      
          ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;
      
          if (ret === false || (ret === void 0 && valueA !== valueB)) {
            return false;
          }
        }
      
        return true;
      }

    var instMapCompositeComponent = new Map();
    var instMapDom = new Map();
    var CompositeType;
    (function (CompositeType) {
        CompositeType[CompositeType["ReactComponent"] = 0] = "ReactComponent";
        CompositeType[CompositeType["StateLessComponent"] = 1] = "StateLessComponent";
        CompositeType[CompositeType["PureComponent"] = 2] = "PureComponent";
    })(CompositeType || (CompositeType = {}));
    function transformStateLessToComponent(props, context) {
        var component = new ReactComponent(props, context);
        component.render = function () {
            var internalInst = instMapCompositeComponent.get(this);
            if (internalInst) {
                var fn = internalInst._currentElement.tagName;
                if (!isReactComponentClass(fn)) {
                    return fn(this.props);
                }
            }
            return null;
        };
        return component;
    }
    var ReactCompositeComponent = /** @class */ (function () {
        function ReactCompositeComponent(node, container) {
            this._currentElement = node;
            this._container = container;
        }
        ReactCompositeComponent.prototype.mountComponent = function (context, replaceNode, isInsert) {
            this._context = context;
            if (replaceNode !== undefined) {
                this._replaceNode = replaceNode;
            }
            this._isInsert = !!isInsert;
            var TagName = this._currentElement.tagName;
            var isComponent = isReactComponentClass(TagName);
            var props = this._currentElement.props;
            var _currentContext = this._processContext(context);
            if (isReactComponentClass(TagName)) {
                this.inst = new TagName(props, _currentContext);
                this._compositeType = CompositeType.ReactComponent;
                if (isPureComponentClass(TagName)) {
                    this._compositeType = CompositeType.PureComponent;
                }
                else {
                    this._compositeType = CompositeType.ReactComponent;
                }
            }
            else {
                this.inst = transformStateLessToComponent(props, _currentContext);
                this._compositeType = CompositeType.StateLessComponent;
            }
            // this.inst = new TagName(props);
            instMapCompositeComponent.set(this.inst, this);
            this._container && instMapDom.set(this._container, this);
            this.inst.componentWillMount && this.inst.componentWillMount();
            this.mountChildComponent();
            this.inst.componentDidMount && this.inst.componentDidMount();
            if (this._currentElement.ref) {
                this._ref = this._currentElement.ref;
                this._ref(this.inst);
            }
        };
        ReactCompositeComponent.prototype.isComponentClass = function (tagName) {
            return tagName.prototype instanceof ReactComponent;
        };
        ReactCompositeComponent.prototype.initialInst = function () {
        };
        ReactCompositeComponent.prototype.mountChildComponent = function () {
            var renderElement;
            var toRenderElement = this.inst.render();
            if (Array.isArray(toRenderElement)) {
                renderElement = toRenderElement[0];
            }
            else {
                renderElement = toRenderElement;
            }
            this._renderComponent = ReactReconciler.initialComponent(renderElement, this._container);
            var nextContext = this._processChildContext();
            this._renderComponent.mountComponent(nextContext, this._replaceNode, this._isInsert);
        };
        ReactCompositeComponent.prototype.updateComponent = function (prevElement, nextElement, nextContext) {
            var nextProps = nextElement.props;
            var prevProps = prevElement.props;
            var nextState = this._processNewState(prevProps);
            var shouldUpdate = true;
            var isRealUpdate = !shallowEqual(nextProps, prevProps) || !shallowEqual(this.inst.state || null, nextState);
            var willReceive = false;
            // nextContext = this._processContext(nextContext);
            if (nextContext !== this._context) {
                nextContext = this._processContext(nextContext);
                willReceive = true;
            }
            if (prevElement !== nextElement) {
                willReceive = true;
            }
            if (this.inst.componentWillReceiveProps && willReceive) {
                this.inst.componentWillReceiveProps(nextProps, nextContext);
            }
            if (this.inst.shouldComponentUpdate) {
                shouldUpdate = this.inst.shouldComponentUpdate(nextProps, nextState, nextContext);
            }
            if (this._compositeType === CompositeType.PureComponent) {
                shouldUpdate = isRealUpdate;
            }
            if (shouldUpdate) {
                this._performComponentUpdate(nextElement, nextProps, nextState, nextContext);
                if (isRealUpdate && this._ref) {
                    this._ref(this.inst);
                }
            }
            else {
                this.inst.props = nextProps;
                this.inst.state = nextState;
                this.inst.context = nextContext;
                this._currentElement = nextElement;
            }
        };
        ReactCompositeComponent.prototype._processNewState = function (prevProps) {
            var state = this.inst.state || null;
            if (this._peddingState && this._peddingState.length > 0) {
                this._peddingState.forEach(function (changeState, index) {
                    Object.assign(state, typeof changeState === "function" ? changeState(state, prevProps) : changeState);
                });
                this._peddingState = [];
                return state;
            }
            return state;
        };
        ReactCompositeComponent.prototype._performComponentUpdate = function (nextElement, nextProps, nextState, nextContext) {
            var prevProps;
            var prevState;
            var prevContext;
            var inst = this.inst;
            var hasDidUpdate = !!inst.componentDidUpdate;
            if (hasDidUpdate) {
                prevProps = inst.props;
                prevState = inst.state;
                prevContext = inst.context;
            }
            inst.componentWillUpdate && inst.componentWillUpdate(nextProps, nextState, nextContext);
            // 更新数据
            inst.props = nextProps;
            inst.state = nextState;
            inst.context = nextContext;
            this._updateRenderComponent();
            inst.componentDidUpdate && inst.componentDidUpdate(prevProps, prevState, prevContext);
        };
        ReactCompositeComponent.prototype._updateRenderComponent = function () {
            var prevComponentInstance = this._renderComponent;
            var prevRenderElement = prevComponentInstance._currentElement;
            var nextRenderElement;
            var toNextRenderElement = this.inst.render();
            if (Array.isArray(toNextRenderElement)) {
                nextRenderElement = toNextRenderElement[0];
            }
            else {
                nextRenderElement = toNextRenderElement;
            }
            var nextChildContext = this._processChildContext();
            if (ReactReconciler.shouldUpdateReactComponent(prevRenderElement, nextRenderElement)) {
                ReactReconciler.receiveComponent(prevComponentInstance, nextRenderElement, nextChildContext);
            }
            else {
                var container = this._container;
                var hostNode = ReactReconciler.getHostNode(this._renderComponent);
                this._renderComponent.unmountComponent();
                this._renderComponent = ReactReconciler.initialComponent(nextRenderElement, container);
                this._renderComponent.mountComponent(nextChildContext, hostNode);
            }
        };
        ReactCompositeComponent.prototype.receiveComponent = function (nextElement, nextContext) {
            if (!nextElement) {
                nextElement = this._currentElement;
            }
            if (!nextContext) {
                nextContext = this._context;
            }
            this.updateComponent(this._currentElement, nextElement, nextContext);
        };
        ReactCompositeComponent.prototype.unmountComponent = function () {
            var inst = this.inst;
            inst.componentWillUnmount && inst.componentWillUnmount();
            this._renderComponent && ReactReconciler.unmountComponent(this._renderComponent);
            this._ref && this._ref(null);
            delete this.inst;
            delete this._renderComponent;
            delete this._currentElement;
            delete this._peddingState;
            delete this._ref;
            instMapCompositeComponent.delete(inst);
        };
        // context
        ReactCompositeComponent.prototype._processContext = function (context) {
            // handle context from parent
            var Component = this._currentElement.tagName;
            var contextType = Component.contextTypes;
            var _currentContext = {};
            if (contextType && context) {
                for (var key in contextType) {
                    _currentContext[key] = context[key];
                }
            }
            // this._context = _currentContext;
            return _currentContext;
        };
        ReactCompositeComponent.prototype._processChildContext = function () {
            var Component = this._currentElement.tagName;
            var inst = this.inst;
            if (isReactComponentClass(Component) && inst.getChildContext) {
                if (Component.childContextTypes) {
                    var childContext = inst.getChildContext();
                    if (childContext) {
                        for (var key in childContext) {
                            if (!Component.childContextTypes[key]) {
                                throw new Error("Key is not compatiable");
                            }
                        }
                        return Object.assign({}, this._context, childContext);
                    }
                }
                else {
                    throw new Error("You need specific childContextTypes");
                }
            }
            return this._context;
        };
        return ReactCompositeComponent;
    }());

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
    function isReactComponentClass(tagName) {
        return tagName.isReactComponent;
    }
    function isPureComponentClass(tagName) {
        return tagName.isReactPureComponent;
    }

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

    /*
    组件渲染核心流程
    1. 记录组建对应的virtual-dom(组建render时记录)
    2. 记录virtual-dom对应的真实dom(渲染完组建后的第一次renderHTMLElement)
    */
    function render(ele, container) {
        if (container) {
            ReactReconciler.initialComponent(ele, container).mountComponent();
        }
        else {
            var error = new Error("container is not exist");
            throw error;
        }
    }

    exports.render = render;
    exports.Component = Component;
    exports.PureComponent = PureComponent;
    exports.createElement = createElement;
    exports.Children = Children;
    exports.default = React;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
