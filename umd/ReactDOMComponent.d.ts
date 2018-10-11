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
    constructor(ele: ReactDomElement, container: HTMLElement);
    mountComponent(replaceIndex?: number, isInsert?: boolean): void;
    mountIntoDom(replaceIndex?: number, isInsert?: Boolean): void;
    mountChildComponent(children: ReactNode[], container: HTMLElement): void;
    receiveComponent(nextElement: ReactDomElement): void;
    updateComponent(prevElement: ReactDomElement, nextElement: ReactDomElement): void;
    updateChildComponent(children: ReactNode[]): void;
    updateDomElement(changes: IChange[]): void;
    replaceNode(newNode?: ReactElement<string>): void;
    applyMoves(moves: IMove[]): void;
    reorderNode(move: IMove): void;
    unmountComponent(): void;
    updateProps(el: HTMLElement, props: any): void;
    attachEvent(el: HTMLElement, key: string, val: Function): void;
}
export default ReactDOMComponent;
