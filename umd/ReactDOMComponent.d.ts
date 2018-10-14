import ReactElement, { ReactNode, ReactDomElement } from "./ReactElement";
import { ReactRenderComponent } from "./ReactReconciler";
import { IChange, IMove } from "./DomDiff";
declare class ReactDOMComponent {
    _currentElement: ReactDomElement;
    _container: HTMLElement;
    _renderElement: Node;
    _renderChildComponent: ReactRenderComponent[];
    _eventListener: Map<string, (evt: Event) => void>;
    _ref: (e: Node | null) => void;
    _context: any;
    constructor(ele: ReactDomElement, container: HTMLElement);
    mountComponent(context?: any, replaceElement?: Node, isInsert?: boolean): void;
    mountIntoDom(replaceNode?: Node, isInsert?: Boolean): void;
    mountChildComponent(children: ReactNode[], container: HTMLElement): void;
    receiveComponent(nextElement: ReactDomElement, nextContext?: any): void;
    updateComponent(prevElement: ReactDomElement, nextElement: ReactDomElement): void;
    updateChildComponent(children: ReactNode[]): void;
    updateDomElement(changes: IChange[]): void;
    replaceNode(newNode?: ReactElement<string>): void;
    applyMoves(moves: IMove[]): void;
    reorderNode(move: IMove): void;
    unmountComponent(): void;
    updateProps(el: HTMLElement, props: any): void;
    attachEvent<T>(el: HTMLElement, key: string, val?: Function): void;
}
export default ReactDOMComponent;
