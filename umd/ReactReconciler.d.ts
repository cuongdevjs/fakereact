import { ReactNode } from "./ReactElement";
import ReactCompositeComponent from "./ReactCompositeComponent";
import ReactDOMComponent from "./ReactDOMComponent";
export declare type ReactRenderComponent = ReactDOMComponent | ReactCompositeComponent;
declare const ReactReconciler: {
    initialComponent(element: ReactNode, container: Element): ReactRenderComponent;
    receiveComponent(internalInstance: ReactRenderComponent, nextElement: ReactNode, nextContext?: any): void;
    shouldUpdateReactComponent(prevRenderElement: ReactNode, nextRenderElement: ReactNode): boolean;
    unmountComponent(internalInstance: ReactRenderComponent): void;
    getHostNode(component: ReactRenderComponent): Node;
};
export default ReactReconciler;
