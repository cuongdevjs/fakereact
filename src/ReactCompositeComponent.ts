import ReactElement, { SFC, ReactNode } from "./ReactElement"
import ReactComponent, { ComponentClass, isReactComponentClass, isPureComponentClass} from "./ReactComponent"
import ReactReconciler, {ReactRenderComponent} from "./ReactReconciler"
import shallowequal from "./lib/shallowequal"
import ReactDOMComponent from './ReactDOMComponent';

export let instMapCompositeComponent: Map<ReactComponent, ReactCompositeComponent> = new Map();
export let instMapDom: Map<HTMLElement, ReactCompositeComponent> = new Map();

interface ReactCompositeComponent {
    updateComponent<T>(prevElement: T, nextElement: T, nextContext: any): void;
}

enum CompositeType {
    ReactComponent,
    StateLessComponent,
    PureComponent
};

function transformStateLessToComponent(props: any, context: any): ReactComponent {
    let component = new ReactComponent(props, context);
    component.render = function() {
        let internalInst = instMapCompositeComponent.get(this);
        if (internalInst) {
            let fn: ComponentClass | SFC = internalInst._currentElement.tagName;
            if (!isReactComponentClass(fn)) {
                return fn(this.props);
            }
        }
        return null;
    }
    return component;
}

function getHostNode(component: ReactRenderComponent): Node {
    if (component instanceof ReactDOMComponent) {
        return component._renderElement;
    } else {
        return getHostNode(component._renderComponent);
    }
}



class ReactCompositeComponent {
    _currentElement: ReactElement<ComponentClass> | ReactElement<SFC>;
    _renderComponent: ReactRenderComponent;
    inst: ReactComponent;
    _container: HTMLElement;
    _peddingState: any[];
    _replaceNode: Node;
    _isInsert: boolean;
    _compositeType: CompositeType;
    _ref: (e: ReactComponent | null) => void;
    _context: any;

    constructor(node: ReactElement<ComponentClass>, container: HTMLElement) {
        this._currentElement = node;
        this._container = container;
    }

    mountComponent(context?: any, replaceNode?: Node, isInsert?: boolean) {
        this._context = context;
        if (replaceNode !== undefined) {
            this._replaceNode = replaceNode;
        }
        this._isInsert = !!isInsert;
        let TagName: ComponentClass | SFC = this._currentElement.tagName;
        let isComponent = isReactComponentClass(TagName);
        let props: any = this._currentElement.props;
        let _currentContext: any =  this._processContext(context);
        if (isReactComponentClass(TagName)) {
            this.inst = new TagName(props, _currentContext);
            this._compositeType = CompositeType.ReactComponent;
            if (isPureComponentClass(TagName)) {
                this._compositeType = CompositeType.PureComponent;
            } else {
                this._compositeType = CompositeType.ReactComponent;
            }
        } else {
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

    }

    isComponentClass(tagName: ComponentClass | SFC): tagName is ComponentClass {
        return tagName.prototype instanceof ReactComponent; 
    }

    initialInst() {

    }

    mountChildComponent() {
        let renderElement;
        let toRenderElement: ReactNode | ReactNode[] = this.inst.render();
        if (Array.isArray(toRenderElement)) {
            renderElement = toRenderElement[0];
        } else {
            renderElement = toRenderElement;
        }
        this._renderComponent = ReactReconciler.initialComponent(renderElement, this._container);
        const nextContext = this._processChildContext();
        this._renderComponent.mountComponent(nextContext, this._replaceNode, this._isInsert);
    }

    updateComponent(prevElement: ReactElement<ComponentClass>, nextElement: ReactElement<ComponentClass>, nextContext: any) {
        let nextProps: any = nextElement.props;
        let prevProps: any = prevElement.props;
        let nextState: any = this._processNewState(prevProps);
        let shouldUpdate: boolean = true;
        let isRealUpdate: boolean = !shallowequal(nextProps, prevProps) || !shallowequal(this.inst.state || null, nextState);
        let willReceive: boolean = false;
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
        } else {
            this.inst.props = nextProps;
            this.inst.state = nextState;
            this.inst.context = nextContext;
            this._currentElement = nextElement;
        }


    }

    _processNewState(prevProps?: any): any {
        let state = this.inst.state || null;
        if (this._peddingState && this._peddingState.length > 0) {
            this._peddingState.forEach((changeState, index: number) => {
                Object.assign(state, typeof changeState === "function" ? changeState(state, prevProps) : changeState);
            })
            this._peddingState = [];
            return state;
        }
        return state;
    }

    _performComponentUpdate(
        nextElement: ReactElement<ComponentClass>,
        nextProps: any,
        nextState: any,
        nextContext: any
    ) {
        let prevProps: any;
        let prevState: any;
        let prevContext: any;
        let inst: ReactComponent = this.inst;
        let hasDidUpdate: Boolean = !!inst.componentDidUpdate;

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
    }

    _updateRenderComponent() {
        let prevComponentInstance = this._renderComponent;
        let prevRenderElement = prevComponentInstance._currentElement;
        let nextRenderElement: ReactNode;
        let toNextRenderElement: ReactNode | ReactNode[] =  this.inst.render();
        if (Array.isArray(toNextRenderElement)) {
            nextRenderElement = toNextRenderElement[0];
        } else {
            nextRenderElement = toNextRenderElement;
        }
        const nextChildContext = this._processChildContext();

        if (ReactReconciler.shouldUpdateReactComponent(prevRenderElement, nextRenderElement)) {
            ReactReconciler.receiveComponent(prevComponentInstance, nextRenderElement, nextChildContext);
        } else {
            let container: HTMLElement = this._container;
            const hostNode: Node = ReactReconciler.getHostNode(this._renderComponent);
            this._renderComponent.unmountComponent();
            this._renderComponent = ReactReconciler.initialComponent(nextRenderElement, container);
            this._renderComponent.mountComponent(nextChildContext, hostNode);
        }
    }

    receiveComponent(nextElement?: ReactElement<ComponentClass> | ReactElement<SFC>, nextContext?: any) {
        if (!nextElement) {
            nextElement = this._currentElement;
        }

        if (!nextContext) {
            nextContext = this._context;
        }
        this.updateComponent(this._currentElement, nextElement, nextContext);
    }

    unmountComponent() {
        let inst: ReactComponent = this.inst;
        inst.componentWillUnmount && inst.componentWillUnmount();
        this._renderComponent && ReactReconciler.unmountComponent(this._renderComponent);
        this._ref && this._ref(null);
        delete this.inst;
        delete this._renderComponent;
        delete this._currentElement;
        delete this._peddingState;
        delete this._ref;
        instMapCompositeComponent.delete(inst);
    }

    // context
    _processContext(context: any): any {
        // handle context from parent
        const Component = this._currentElement.tagName;
        const contextType = Component.contextTypes;
        let _currentContext: {[key: string]: any} = {};
        if (contextType && context) {
            for (let key in contextType) {
                _currentContext[key] = context[key];
            }
        }
        // this._context = _currentContext;
        return _currentContext;
    }

    _processChildContext(): any {
        const Component = this._currentElement.tagName;
        const inst = this.inst;
        if (isReactComponentClass(Component) && inst.getChildContext) {
            if (Component.childContextTypes) {
                let childContext = inst.getChildContext();
                if (childContext) {
                    for (const key in childContext) {
                        if (!Component.childContextTypes[key]) {
                            throw new Error("Key is not compatiable");
                        }
                    }
                    return Object.assign({}, this._context, childContext);
                }
            } else {
                throw new Error("You need specific childContextTypes");
            }
        }

        return this._context;
    }


}

export default ReactCompositeComponent