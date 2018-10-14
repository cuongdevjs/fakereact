import ReactComponent, {ComponentClass, IContextType} from "./ReactComponent"

export type ReactNode = ValidReactNode | null;
export type childrenType = Array<ReactNode>;
export type ValidReactNode = string | ReactElement<any> | number;
export type ReactDomElement = ReactElement<string> | string | number | null;
export type ReactCompositeElement = ReactElement<ComponentClass> | ReactElement<SFC>;
export interface SFC<P = {}> {
    (props?: P, context?: any):ReactNode;
    contextTypes?: IContextType;
}

export type tagType = string | ComponentClass | SFC;


class ReactElement<T extends tagType> {
    tagName: T;
    props: any;
    children: childrenType;
    key: string | number | null;
    ref?: (e: ReactComponent | Node | null) => void;
    private count: number;

    constructor(
        tagName: T, 
        props?: any, 
        ...children: childrenType
    ) {
        this.tagName = tagName;
        this.props = {};
        this.children = children;

        let arrChildren: ReactNode[] = [];
        let allProps: any = {};

        if (Array.isArray(this.children)) {
            for (let i: number = 0, len: number = this.children.length ; i < len; i++) {
                let child = this.children[i];

                if (typeof child === "number") {
                    this.children[i] = child + '';
                }

                if (Array.isArray(child)) {
                    arrChildren = arrChildren.concat(child);
                } else {
                    arrChildren.push(child);
                }
            }
        }

        // Object.assign(this.props, props);

        this.children = arrChildren;
        if (arrChildren.length > 0) {
            Object.assign(this.props, {
                children: arrChildren
            });
        }

        if (isReactComponent(tagName) && tagName.defaultProps) {
            Object.assign(allProps, tagName.defaultProps, props);
        } else {
            Object.assign(allProps, props);
        }




        

        if (allProps) {
            if (allProps.key) {
                this.key = allProps.key + "";
                // delete allProps.key;
            }
            if (typeof allProps.ref === "function") {
                this.ref = allProps.ref;
                // delete allProps.ref;
            }
        }

        Object.assign(this.props, allProps);
    }
}

export function isReactComponent(tagName: tagType): tagName is ComponentClass {
    return typeof tagName === "function";
}

export function isReactElement(ele: ReactNode): ele is ReactElement<any> {
    return typeof ele !== "string";
}

export function cloneElement<T extends tagType>(element: ReactElement<T>, config?: any, ...children: childrenType): ReactElement<T>  {
    const props = element.props;

    const newConfig = Object.assign({}, props);

    if (config.key) {
        newConfig.key = config.key + '';
    }

    if (typeof config.ref === 'function') {
        newConfig.ref = config.ref;
    }

    Object.assign(newConfig, config);

    return new ReactElement(element.tagName, newConfig, ...children);
}



export default ReactElement;