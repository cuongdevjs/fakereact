import ReactElement, { ReactNode, ReactDomElement, isReactElement } from "./ReactElement"
import diff from "./lib/listDiff"

export enum ChangeType {
    REPLACE,
    REORDER,
    PROPS,
    TEXT,
};

export enum MoveType {
    REMOVE = 0,
    INSERT = 1
};

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
/*
interface IdiffPatch {
    [index: number]: Array<IChange>;
}

function isStringNode(node: ReactNode): node is string {
    return typeof(node) === "string";
}
*/

function diffProps(oldNode: ReactElement<string>, newNode: ReactElement<string>){
    let count: number = 0;
    let oldProps:any = oldNode.props;
    let newProps:any = newNode.props;
    let key: string;
    var propsPatches: any = {};
    // todo 两次for in 循环是否有优化空间
    for (key in oldProps) {
        if (key !== "children") {
            let oldVal = oldProps[key];
            let newVal = newProps[key];
            if (oldVal !== newVal) {
                count++;
                propsPatches[key] = newVal;
            }
        }
    }

    for(key in newProps) {
        if (key !== "children") {
            if (!oldProps.hasOwnProperty(key)) {
                count++;
                propsPatches[key] = newProps[key];
            }
        }
    }

    return count === 0 ? null : propsPatches;
}

function diffChildren(
    oldChildren: Array<ReactNode>,
    newChildren: Array<ReactNode>,
    currentPatch: Array<IChange>
) {
    let diffs: any = diff(oldChildren, newChildren, "key");
    newChildren = diffs.children;

    if (Array.isArray(diffs.moves)) {
        let reorderPatch: IChange = {
            type: ChangeType.REORDER,
            moves: diffs.moves,
            children: newChildren,
        };

        currentPatch.push(reorderPatch);
    }
}

export function dfsWalk(
    oldNode: ReactDomElement,
    newNode: ReactDomElement,
): Array<IChange> {
    let currentPatch: Array<IChange> = [];
    if (!newNode) {
        
    } else if (
        (typeof oldNode === "string" || typeof oldNode === "number") && (typeof newNode === "string" || typeof newNode === "number")) {
        if (oldNode !== newNode) {
            let nodeChange: IChange = {
                type: ChangeType.TEXT,
                content: newNode
            };
            currentPatch.push(nodeChange);
        }
    } else if (isReactElement(oldNode) && isReactElement(newNode)) {
        
        if (oldNode.tagName === newNode.tagName) {
            // 节点未变化
            // 查看属性变更
            let propsPatches = diffProps(oldNode, newNode);
            propsPatches && currentPatch.push({
                type: ChangeType.PROPS,
                props: propsPatches,
            });

            diffChildren(oldNode.children, newNode.children, currentPatch);
        } else {
            currentPatch.push({
                type: ChangeType.REPLACE,
                node: newNode,
            });
        }

    } else {
        currentPatch.push({
            type: ChangeType.REPLACE,
        });
    }

    return currentPatch;
}