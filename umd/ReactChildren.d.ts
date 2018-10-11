import { ReactNode } from "./ReactElement";
export interface IChildrenType {
    count(children: ReactNode[]): number;
    only(children: ReactNode[]): ReactNode | null;
    map<T>(children: ReactNode[], fn: (child: ReactNode, index: number) => T): T[];
    forEach(children: ReactNode[], fn: (child: ReactNode, index: number) => any): any;
    toArray(children: ReactNode[]): ReactNode[];
}
declare const Children: IChildrenType;
export default Children;
