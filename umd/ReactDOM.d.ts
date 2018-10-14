import ReactElement from "./ReactElement";
export declare function render(ele: ReactElement<any> | string, container: HTMLElement | null): void;
declare const ReactDOM: {
    render: typeof render;
};
export default ReactDOM;
