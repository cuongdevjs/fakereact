import ReactComponent, { ReactPureComponent, ComponentClass } from "./ReactComponent";
import ReactElement, { tagType, childrenType, ReactNode, cloneElement } from "./ReactElement";
import Children from "./ReactChildren";
declare global {
    namespace JSX {
        interface Element extends ReactElement<any> {
        }
    }
}
export declare const Component: typeof ReactComponent;
export declare const PureComponent: typeof ReactPureComponent;
export { Children };
export declare type ComponentClass = ComponentClass;
export declare function createElement(tagName: tagType, props: any, ...children: childrenType): ReactElement<any>;
declare const React: {
    createElement: typeof createElement;
    Component: typeof ReactComponent;
    PureComponent: typeof ReactPureComponent;
    Children: import("./ReactChildren").IChildrenType;
    cloneElement: typeof cloneElement;
    isValidElement(child: ReactNode): boolean;
};
export default React;
