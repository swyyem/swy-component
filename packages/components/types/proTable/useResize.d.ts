import { type Ref } from 'vue';
import type { ProTableToolbarInstance } from './table.types';
type UseResizeOptions = {
    tableBodyRef: Ref<HTMLElement | null>;
    tableHeaderRef: Ref<ProTableToolbarInstance | null>;
    height?: number;
    maxHeight?: number;
    autoHeight: boolean;
    width?: number;
    hasCreator: boolean;
    hasPager: boolean;
};
export declare const useResize: (options: UseResizeOptions) => {
    bodyHeight: Ref<number, number>;
    maxHeight: Ref<number | undefined, number | undefined>;
    bodyWidth: Ref<number, number>;
    calculateBodyHeight: () => void;
};
export {};
