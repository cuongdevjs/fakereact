import ReactElement, { ReactNode, ReactDomElement } from "./ReactElement";
export declare enum ChangeType {
    REPLACE = 0,
    REORDER = 1,
    PROPS = 2,
    TEXT = 3
}
export declare enum MoveType {
    REMOVE = 0,
    INSERT = 1
}
export interface IMove {
    type: MoveType;
    item?: ReactNode;
    index: number;
}
export interface IChange {
    type: ChangeType;
    content?: string | number;
    props?: any;
    newNode?: ReactElement<any>;
    moves?: Array<IMove>;
    node?: ReactElement<string>;
    children?: ReactNode[];
}
export declare function dfsWalk(oldNode: ReactDomElement, newNode: ReactDomElement): Array<IChange>;
