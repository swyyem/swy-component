import { type ComputedRef, type Ref } from 'vue';
import type { ProComponentObject } from '../common.types';
import type { ProTableRowSelectionProps, ProTableGetRowKey, KeyType } from './table.types';
type UseCheckOptions<T> = {
    rowSelection: Ref<ProTableRowSelectionProps<T> | undefined>;
    getRowKey: ComputedRef<ProTableGetRowKey<T>>;
    getData: () => T[];
};
export declare const useCheck: <T extends ProComponentObject>(options: UseCheckOptions<T>) => {
    rowSelectionProps: ComputedRef<{
        hideSelectAll?: boolean;
        reserveSelection?: boolean;
        rowClick?: boolean;
        onChange?: ((selectedRowKeys: KeyType[], selectedRows: T[]) => void) | undefined;
        onSelect?: ((selectedRows: T[], row: T) => void | boolean | Promise<boolean>) | undefined;
        type: "checkbox" | "radio" | undefined;
        repel: boolean;
        checkStrictly: boolean;
        childrenCheckbox: boolean;
        selectable: (rowData: T) => boolean;
        selectedRowKeys: PropertyKey[];
    }>;
    selectionRowKeys: Ref<PropertyKey[], PropertyKey[]>;
    selectionRowDatas: import("vue").ShallowRef<T[], T[]>;
    selectionDataLoad: () => void;
    getSelectionRows: () => T[];
};
export {};
