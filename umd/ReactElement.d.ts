import ReactComponent, { ComponentClass } from "./ReactComponent";
export declare type ReactNode = ValidReactNode | null;
export declare type childrenType = Array<ReactNode>;
export declare type ValidReactNode = string | ReactElement<any> | number;
export declare type ReactDomElement = ReactElement<string> | string | number | null;
export declare type ReactCompositeElement = ReactElement<ComponentClass> | ReactElement<SFC>;
export interface SFC<P = {}> {
    (props?: P): ReactNode;
}
export declare type tagType = string | ComponentClass | SFC;
declare class ReactElement<T extends tagType> {
    tagName: T;
    props: any;
    children: childrenType;
    key: string | number | null;
    ref?: (e: ReactComponent | Node | null) => void;
    private count;
    constructor(tagName: T, props?: any, ...children: childrenType);
}
export declare function isReactComponent(tagName: tagType): tagName is ComponentClass;
export declare function isReactElement(ele: ReactNode): ele is ReactElement<any>;
export default ReactElement;
