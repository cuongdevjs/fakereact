import ReactElement, { ReactNode } from "./ReactElement"
import ReactCompositeComponent from "./ReactCompositeComponent"
import ReactDOMComponent from "./ReactDOMComponent"

export type ReactRenderComponent = ReactDOMComponent | ReactCompositeComponent;


const ReactReconciler = {

    initialComponent(element: ReactNode, container: HTMLElement): ReactRenderComponent {
        let internalInst: ReactRenderComponent;
        if (element instanceof ReactElement) {
            if (typeof element.tagName === "string") {
                internalInst = new ReactDOMComponent(element, container);
            } else {
                internalInst = new ReactCompositeComponent(element, container);
            }
        } else {
            internalInst = new ReactDOMComponent(element, container);
        }

        return internalInst;
    },

    receiveComponent(internalInstance: ReactRenderComponent, nextElement: ReactNode, nextContext?: any) {
        if (nextElement instanceof ReactElement) {
            if (typeof nextElement.tagName === "string" && internalInstance instanceof ReactDOMComponent) {
                internalInstance.receiveComponent(nextElement, nextContext);
            } else if (internalInstance instanceof ReactCompositeComponent) {
                internalInstance.receiveComponent(nextElement, nextContext);
            } else {
                throw new Error("element and component are not compatible");
            }
        } else if (internalInstance instanceof ReactDOMComponent) {
            internalInstance.receiveComponent(nextElement, nextContext);
        } else {
            throw new Error("element and component are not compatible");
        }
    },

    shouldUpdateReactComponent(
        prevRenderElement: ReactNode,
        nextRenderElement: ReactNode): Boolean
    {
        if (typeof prevRenderElement === "string" || typeof prevRenderElement === "number") {
            return typeof nextRenderElement === "string" || typeof prevRenderElement === "number";
        } else if (nextRenderElement instanceof ReactElement && prevRenderElement instanceof ReactElement) {
            return prevRenderElement.tagName === nextRenderElement.tagName && prevRenderElement.key === nextRenderElement.key;
        } else {
            return false;
        }
    },

    unmountComponent(internalInstance: ReactRenderComponent) {
        internalInstance.unmountComponent();
    },

    getHostNode(component: ReactRenderComponent) {
        if (component instanceof ReactDOMComponent) {
            return component._renderElement;
        }
        return this.getHostNode(component._renderComponent);
    }

}

export default ReactReconciler;