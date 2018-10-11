import ReactComponent, { ReactPureComponent, ComponentClass } from "./ReactComponent"
import ReactElement, {tagType, childrenType, ReactNode, cloneElement} from "./ReactElement"
import Children from "./ReactChildren"


declare global {
    namespace JSX {
        interface Element extends ReactElement<any> {}
    }
}








export const Component = ReactComponent;
export const PureComponent = ReactPureComponent;
export {Children};
export type ComponentClass = ComponentClass;
export function createElement(tagName: tagType, props: any, ...children: childrenType): ReactElement<any> {
    return new ReactElement(tagName, props, ...children);
}

const React = {
    createElement,
    Component: ReactComponent,
    PureComponent: ReactPureComponent,
    Children,
    cloneElement,
    isValidElement(child: ReactNode): boolean {
        return child instanceof ReactElement;
    }
};
export default React


