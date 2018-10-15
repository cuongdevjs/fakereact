import { ReactNode } from "./ReactElement"

export interface IChildrenType {
    count(children: ReactNode[]): number;
    only(children: ReactNode[]): ReactNode | null;
    map<T>(children: ReactNode[], fn: (child: ReactNode, index: number) => T): T[];
    forEach(children: ReactNode[], fn: (child: ReactNode, index: number) => any): any;
    toArray(children: ReactNode[]): ReactNode[];
}



const Children: IChildrenType = {
    count(children: ReactNode[]) {
        return children.length;
    },
    only(children: ReactNode[]) {
        if (children.length === 1) {
            return children[0];
        } else {
            throw new Error("Not the only child");
        }
    },
    forEach(children, fn) {
        if (Array.isArray(children)) {
            return children.forEach(fn);
        }
    },
    map(children, fn) {
        return children.map(fn);
    },
    toArray(children) {
        return children;
    }
}


export default Children;

