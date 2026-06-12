import { type Ref, type ComputedRef } from 'vue';
import type { DeferredExcutorType } from '../utils/defer';
import type { ProTableGetRowKey, ProTableRowDirection, ProTableRowClassNameParams, ProTableContentInstance, ProTableRowClassName, ProTableRowSelectionData } from './table.types';
type UseNavigateOptions<T> = {
    deferReadyExecutor: DeferredExcutorType;
    tableContentRef: Ref<ProTableContentInstance<T> | undefined>;
    rowSelectionProps: ComputedRef<ProTableRowSelectionData<T>>;
    rowClassName?: ProTableRowClassName;
    getTableDataSize: () => number;
    getTableDataHasKey: () => T[];
    getRowDataByIndex: (v: number) => T;
    getRowKey: ComputedRef<ProTableGetRowKey<T>>;
    getCurrentSelectedRow: () => T | undefined;
};
export declare const useNavigate: <T>({ deferReadyExecutor, tableContentRef, rowSelectionProps, rowClassName, getTableDataSize, getTableDataHasKey, getRowDataByIndex, getRowKey, getCurrentSelectedRow, }: UseNavigateOptions<T>) => {
    setRowClassName: ComputedRef<(data: ProTableRowClassNameParams<T>) => string | undefined>;
    navigateRow: (direction: ProTableRowDirection) => void;
    setNavigateRow: () => T | undefined;
    getNavigateRow: () => T;
    scrollToCurrentRow: () => void;
    setHoverIndex: (n: number) => void;
};
export {};
