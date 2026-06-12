import { type Ref, type ComputedRef } from 'vue';
import type { ProTablePageParams } from './table.types';
type UseDynamicPageSizeOptions = {
    columnsDepth: Ref<number>;
    bodyHeight: Ref<number>;
    pageInfo: ProTablePageParams;
    setPage: (changedPage: ProTablePageParams) => void;
    firstRef: Ref<boolean>;
    rowHeight?: number;
    waterfall: boolean;
    isAutoPageSize: ComputedRef<boolean>;
};
export declare const useDynamicPageSize: (options: UseDynamicPageSizeOptions) => {
    getPageSize: () => number;
    calculateAndSetPageSize: () => void;
};
export {};
