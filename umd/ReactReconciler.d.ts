import { ReactNode } from "./ReactElement";
import ReactCompositeComponent from "./ReactCompositeComponent";
import ReactDOMComponent from "./ReactDOMComponent";
export declare type ReactRenderComponent = ReactDOMComponent | ReactCompositeComponent;
declare const ReactReconciler: {
    initialComponent(element: ReactNode, container: HTMLElement): ReactRenderComponent;
    receiveComponent(internalInstance: ReactRenderComponent, nextElement: ReactNode): void;
    shouldUpdateReactComponent(prevRenderElement: ReactNode, nextRenderElement: ReactNode): Boolean;
    unmountComponent(internalInstance: ReactRenderComponent): void;
};
export default ReactReconciler;
