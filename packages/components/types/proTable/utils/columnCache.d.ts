import type { VNode } from 'vue';
interface ColumnCacheProps<T> {
    row: T;
    rowIndex: number;
    cellIndex: number;
    content: (row: T, rowIndex: number, cellIndex: number) => VNode | VNode[] | null;
}
declare const ColumnCache: {
    <T>(props: ColumnCacheProps<T>): VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[] | null;
    displayName: string;
};
export default ColumnCache;
