import ReactElement, { ReactNode, ReactDomElement } from "./ReactElement"
import ReactReconciler, {ReactRenderComponent} from "./ReactReconciler"
import { dfsWalk, ChangeType, IChange, IMove, MoveType } from "./DomDiff"
import transformToCssKey from "./csskey"

function isAttachEvent(key: string): Boolean {
    if (key.substring(0,2) === "on") {
        return true;
    }
    return false;
}

function isPropsChildren(key: string): Boolean {
    return key === "children";
}

class ReactDOMComponent {
    _currentElement: ReactDomElement;
    _container: Element;
    _renderElement: Node;
    _renderChildComponent: ReactRenderComponent[];
    _eventListener: Map<string, (evt: Event) => void>;
    _ref: (e: Node | null) => void;
    _context: any;
    private svgNamespaceURI = "http://www.w3.org/2000/svg"; 

    constructor(ele: ReactDomElement, container: Element) {
        this._currentElement = ele;
        this._container = container;
    }
    

    mountComponent(context?: any, replaceElement?: Node, isInsert?: boolean) {
        this._context = context;
        if (this._currentElement instanceof ReactElement) {
            let props: any = this._currentElement.props;
            let tagName: string = this._currentElement.tagName;
            let namespaceURI = this._container.namespaceURI;
            if (tagName === "svg") {
                namespaceURI = this.svgNamespaceURI;
            }
            let el: Element = document.createElementNS(namespaceURI, tagName);
            this.updateProps(el, props);

            this._renderElement = el;
            this.mountIntoDom(replaceElement, isInsert);
            if (props && Array.isArray(props.children)) {
                this.mountChildComponent(props.children, el);
            }

            let ref = this._currentElement.ref;
            if (ref) {
                this._ref = ref;
                ref(this._renderElement);
            }

        } else if (!!this._currentElement || this._currentElement === 0) {
            let textNode = document.createTextNode(this._currentElement + '');
            this._renderElement = textNode;
            this.mountIntoDom(replaceElement, isInsert);
        } else {
            let commentNode: Comment = document.createComment("Empty Node");
            this._renderElement = commentNode;
            this.mountIntoDom(replaceElement, isInsert);
        }

    }

    mountIntoDom(replaceNode?: Node, isInsert?: Boolean) {
        if (replaceNode !== undefined) {
            // let replaceNode: Node = this._container.childNodes[replaceIndex];
            if (isInsert) {
                this._container.insertBefore(this._renderElement, replaceNode);
            } else {
                this._container.replaceChild(this._renderElement, replaceNode);
            }
        } else {
            this._container.appendChild(this._renderElement);
        }
    }

    mountChildComponent(children: ReactNode[], container: Element) {
        children.forEach((child: ReactNode, index: number) => {
            let renderComponent: ReactRenderComponent = ReactReconciler.initialComponent(child, container);
            if (!this._renderChildComponent) {
                this._renderChildComponent = [];
            }
            this._renderChildComponent.push(renderComponent);
            renderComponent.mountComponent(this._context);
        });
    }

    receiveComponent(nextElement: ReactDomElement, nextContext?: any) {
        this._context = nextContext;
        this.updateComponent(this._currentElement, nextElement);
    }

    updateComponent(prevElement: ReactDomElement, nextElement: ReactDomElement) {
        let changes: IChange[] = dfsWalk(prevElement, nextElement);
        if (changes.length > 0) {
            this.updateDomElement(changes);
            this._ref && this._ref(this._renderElement);
        }
        this._currentElement = nextElement;



    }

    updateChildComponent(children: ReactNode[]) {
        let currentIndex:number = 0;
        children.forEach((child: ReactNode, index: number) => {
            if (this._renderChildComponent && this._renderChildComponent[index]) {
                let prevInstance: ReactRenderComponent = this._renderChildComponent[index];
                let prevElement: ReactNode = prevInstance._currentElement;
                if (ReactReconciler.shouldUpdateReactComponent(prevElement, child)) {
                    ReactReconciler.receiveComponent(prevInstance, child, this._context);
                } else {
                    // prevInstance.unmountComponent();
                    let nextContainer: Element;

                    if (this._renderElement instanceof HTMLElement) {
                        nextContainer = this._renderElement;
                    } else {
                        nextContainer = this._container;
                    }
                    this._renderChildComponent[index] = ReactReconciler.initialComponent(child, nextContainer);
                    const hostNode = ReactReconciler.getHostNode(prevInstance);
                    this._renderChildComponent[index].mountComponent({}, hostNode);
                    prevInstance.unmountComponent();
                }
            } else {
                if (this._renderElement instanceof HTMLElement) {
                    if (child || child === 0) {
                        this._renderChildComponent[index] = ReactReconciler.initialComponent(child, this._renderElement);
                        this._renderChildComponent[index].mountComponent(this._context);
                    }
                }
            }
        })
    }

    updateDomElement(changes: IChange[]) {
        changes.forEach((change: IChange, index: number) => {
            let el: Node = this._renderElement;
            switch(change.type) {
                case ChangeType.TEXT:
                    if ((<Text>el).nodeValue && !!change.content) {
                        (<Text>el).nodeValue = change.content + "";
                    }
                break;

                case ChangeType.PROPS:
                    if (el instanceof HTMLElement && !!change.props) {
                        this.updateProps(el, change.props);
                    }
                break;

                case ChangeType.REPLACE:
                    this.replaceNode(change.node);
                break;

                case ChangeType.REORDER:
                    if (change.children) {
                        this.updateChildComponent(change.children);
                    }

                    if (change.moves) {
                        this.applyMoves(change.moves);
                    }
                break;
                    
            }
        })
    }

    replaceNode(newNode?: ReactElement<string>) {

        if (newNode) {
            this._currentElement = newNode;
            let el: HTMLElement = document.createElement(newNode.tagName);
            this.updateProps(el, newNode.props);
            this._eventListener && this._eventListener.clear();
            this._container.replaceChild(el, this._renderElement);
            this._renderElement = el;
            this._renderChildComponent = [];
        } else {
            //
        }
    }

    applyMoves(moves: IMove[]) {
        moves.forEach((move: IMove, index: number) => this.reorderNode(move));
    }

    reorderNode(move: IMove) {
        if (move.type === MoveType.INSERT) {
            if (move.item !== undefined) {
                let container: Element;
                if (this._renderElement instanceof HTMLElement) {
                    container = this._renderElement;
                } else {
                    container = this._container;
                }
                let renderComponent: ReactRenderComponent = ReactReconciler.initialComponent(move.item, container);
                if (this._renderChildComponent) {
                    this._renderChildComponent.splice(move.index, 0, renderComponent);
                    const hostNode: Node = container.childNodes[move.index];
                    renderComponent.mountComponent(this._context, hostNode, true);
                } else {
                    this._renderChildComponent = [renderComponent];
                    renderComponent.mountComponent(this._context);
                }
            }
        } else {
            this._renderChildComponent[move.index] && this._renderChildComponent[move.index].unmountComponent();
            this._renderChildComponent.splice(move.index, 1);
            let removeNode: Node = this._renderElement.childNodes[move.index];
            this._renderElement.removeChild(removeNode);
        }
    }

    unmountComponent() {
        if (Array.isArray(this._renderChildComponent)) {
            this._renderChildComponent.forEach((child: ReactRenderComponent, index: number) => {
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
    }

    updateProps(el:Element, props: any) {
        for (let key in props) {
            if (props[key] !== undefined) {
                if (key === "className") {
                    el.setAttribute("class", props[key]);
                } else if (isAttachEvent(key)) {
                    if (el instanceof HTMLElement || el instanceof SVGElement) {
                        this.attachEvent(el, key, props[key]);
                    }
                } else if (key === "ref" || isPropsChildren(key)) {
                    
                } else if (key === "value") {
                    if (this._currentElement instanceof ReactElement) {
                        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
                            el.value = props[key];
                            this.attachEvent(el, "onInput");
                        }
                    }
                } else if (key === "style") {
                    const style = props[key];
                    const keys: Array<string> = Object.keys(style);
                    let cssarr = keys.map((ele: string, index: number) => {
                        const cssval = style[ele];
                        const csskey = transformToCssKey(ele);
                        return `${csskey}: ${cssval}`;
                    });
                    cssarr.length && el.setAttribute("style", cssarr.join(";"));
                } else if (key === "xlinkHref") {
                    el.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", props[key]);
                }
                else {
                    el.setAttribute(key, props[key]);
                }
            }
        }
    }

    attachEvent<T>(el: SVGElement | HTMLElement, key: string, val?: Function) {
        let eventName: string = key.substring(2).toLowerCase();
        let eventHandle: (e: Event) => void;
        const that = this;

        if ((el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) && (eventName === "input" || eventName === "change")) {
            eventName = "input";
            eventHandle = function(e: Event): void {
                let value: any;

                val && val(e);
                if (that._currentElement instanceof ReactElement) {
                    value = that._currentElement.props.value;
                }

                switch (el.type) {
                    case "text":
                        el.value = value;
                    break;

                    case "checkbox":
                        // el.checked = value;
                    break;

                    default: 
                        el.value = value;
                }
            }
        } else {
            eventHandle = function(e: Event): void {
                e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                val && val(e);
            }
        }
        let oldEventListener: (evt: Event) => void;


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
        } else {
            this._eventListener.set(eventName, eventHandle);
            el.addEventListener(eventName, eventHandle, false);
        }
    }
}

export default ReactDOMComponent