import ReactElement from "./ReactElement";
import ReactComponent from './ReactComponent';
export declare function render(ele: ReactElement<any> | string, container: HTMLElement | null): void;
export declare function findDOMNode(component: ReactComponent): Node | null;
export declare function unmountComponentAtNode(node: HTMLElement): void;
declare const ReactDOM: {
    render: typeof render;
    findDOMNode: typeof findDOMNode;
    unmountComponentAtNode: typeof unmountComponentAtNode;
};
export default ReactDOM;
