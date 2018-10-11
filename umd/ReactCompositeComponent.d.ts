import ReactElement, { SFC } from "./ReactElement";
import ReactComponent, { ComponentClass } from "./ReactComponent";
import { ReactRenderComponent } from "./ReactReconciler";
export declare let instMapCompositeComponent: Map<ReactComponent, ReactCompositeComponent>;
interface ReactCompositeComponent {
    updateComponent<T>(prevElement: T, nextElement: T): void;
}
declare enum CompositeType {
    ReactComponent = 0,
    StateLessComponent = 1,
    PureComponent = 2
}
declare class ReactCompositeComponent {
    _currentElement: ReactElement<ComponentClass> | ReactElement<SFC>;
    _renderComponent: ReactRenderComponent;
    inst: ReactComponent;
    _container: HTMLElement;
    _peddingState: any[];
    _replaceIndex: number;
    _isInsert: boolean;
    _compositeType: CompositeType;
    _ref: (e: ReactComponent | null) => void;
    constructor(node: ReactElement<ComponentClass>, container: HTMLElement);
    mountComponent(replaceIndex?: number, isInsert?: boolean): void;
    isComponentClass(tagName: ComponentClass | SFC): tagName is ComponentClass;
    initialInst(): void;
    mountChildComponent(): void;
    _processNewState(prevProps?: any): any;
    _performComponentUpdate(nextElement: ReactElement<ComponentClass>, nextProps: any, nextState: any): void;
    _updateRenderComponent(): void;
    receiveComponent(nextElement?: ReactElement<ComponentClass> | ReactElement<SFC>): void;
    unmountComponent(): void;
}
export default ReactCompositeComponent;
