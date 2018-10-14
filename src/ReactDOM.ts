import ReactElement from "./ReactElement"
import ReactReconciler from "./ReactReconciler"



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

const ReactDOM = {
    render,
}



export default ReactDOM;