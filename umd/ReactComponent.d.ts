import { ReactNode, SFC } from "./ReactElement";
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
interface IPropsExtend {
    children?: ReactNode[] | ReactNode;
}
declare class ReactComponent<P = {}, S = {}> {
    props: Readonly<P> & IPropsExtend;
    state: Readonly<S>;
    context: any;
    refs: any;
    isReactComponent: any;
    static isReactComponent: boolean;
    constructor(props: Readonly<P>, context?: any);
    setState<T extends keyof S>(partState: (Pick<S, T> | S | null) | ((prevState?: Readonly<S>, props?: Readonly<P>) => Pick<S, T> | S | null), cb?: () => void): void;
    forceUpdate(cb?: () => void): void;
}
export declare class ReactPureComponent<P = {}, S = {}> extends ReactComponent<P, S> {
    static isReactPureComponent: boolean;
    constructor(props: P, context?: any);
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
export declare function isReactComponentClass(tagName: ComponentClass | SFC): tagName is ComponentClass;
export declare function isPureComponentClass(tagName: ComponentClass): boolean;
export default ReactComponent;
