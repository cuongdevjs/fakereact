import ReactElement from "./ReactElement"
import ReactReconciler, { ReactRenderComponent } from "./ReactReconciler"
import ReactCompositeComponent, { instMapCompositeComponent, instMapDom } from "./ReactCompositeComponent"
import ReactComponent from './ReactComponent';



/*
组件渲染核心流程
1. 记录组建对应的virtual-dom(组建render时记录)
2. 记录virtual-dom对应的真实dom(渲染完组建后的第一次renderHTMLElement)
*/


export function render(ele: ReactElement<any> | string, container: HTMLElement | null): void {
   if (container) {
        ReactReconciler.initialComponent(ele, container).mountComponent();
   } else {
       var error: Error = new Error("container is not exist");
       throw error;
   }
}

export function findDOMNode(component: ReactComponent) {
    let renderComponent = instMapCompositeComponent.get(component);
    if (renderComponent) {
        return ReactReconciler.getHostNode(renderComponent);
    }

    return null;
}

export function unmountComponentAtNode(node: HTMLElement): void {
    let component: ReactCompositeComponent | undefined = instMapDom.get(node);
    if (component) {
        component.unmountComponent();
    }
}

const ReactDOM = {
    render,
    findDOMNode,
    unmountComponentAtNode
}



export default ReactDOM;