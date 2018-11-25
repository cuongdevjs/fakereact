import { ReactNode, SFC } from "./ReactElement"
import ReactCompositeComponent, { instMapCompositeComponent } from "./ReactCompositeComponent"

interface ComponentLifecycle<P, S> {
     componentWillMount?(): void;
     componentDidMount?(): void;  
     shouldComponentUpdate?(nextProps: P, nextState: S, nextContext: any): boolean;
     componentWillUpdate?(nextProps: P, nextState: S, nextContext: any): void;
     componentDidUpdate?(prevProps: P, prevState: S, prevContext: any): void;
     componentWillReceiveProps?(nextProps: P, nextContext: any): void;
     componentWillUnmount?(): void;
}

interface ReactComponent<P = {}, S = {}> extends ComponentLifecycle<P, S> {
    render(): ReactNode;
    getChildContext?(): any;
}

export interface IPropsExtend {
    children?: ReactNode[] | ReactNode;
}

class ReactComponent<P = {}, S = {}> {
    props: Readonly<P> & IPropsExtend;
    state: Readonly<S>;
    context: any;
    refs: any;
    isReactComponent: any;
    static isReactComponent: boolean = true;

    constructor(props: Readonly<P>, context?: any) {
        this.props = props;
        this.context = context;
    }

    setState<T extends keyof S>(partState: (Pick<S, T> | S | null) | ((prevState?: Readonly<S>, props?: Readonly<P>) => Pick<S, T> | S | null), cb?: ()=>void) {
        let internalInstance: ReactCompositeComponent | undefined = instMapCompositeComponent.get(this);

        if (internalInstance) {
            internalInstance._peddingState = internalInstance._peddingState || [];
            internalInstance._peddingState.push(partState);
            internalInstance.receiveComponent();
            cb && cb();
        }
    }

    forceUpdate(cb?: () => void) {
        let internalInstance = instMapCompositeComponent.get(this);
        if (internalInstance) {
            internalInstance.receiveComponent();
            cb && cb();
        }
    }
}

ReactComponent.prototype.isReactComponent = {};

export class ReactPureComponent<P = {}, S = {}> extends ReactComponent<P, S> {
    static isReactPureComponent: boolean = true;

    constructor(props: P, context?: any) {
        super(props, context);
    }
}

export interface IContextType {
    [key: string]: any;
}



export interface ComponentClass<P = {}, S = {}> {
    new (props: P, context?: any): ReactComponent<P, S>;
    isReactComponent: boolean;
    isReactPureComponent: boolean;
    displayName?: string;
    contextTypes?: IContextType;
    childContextTypes?: IContextType;
    defaultProps?: any;
}

export function isReactComponentClass(tagName: ComponentClass | SFC): tagName is ComponentClass {
    return (<ComponentClass> tagName).isReactComponent;
}

export function isPureComponentClass(tagName: ComponentClass): boolean {
    return tagName.isReactPureComponent;
}
export default ReactComponent