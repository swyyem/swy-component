import type { ProComponentObject } from '../../common.types';
import type { ProTableGetRowKey, KeyType, ProColumn, ProColumns } from '../table.types';
import type { ProTableEditContext } from '../proTableEdit.types';
/**
 * 使用map 来删除数据，性能一般 但是准确率比较高
 * 修改成使用内部的 key 来做匹配，未考虑 children 的场景 edit by 2025/05/13
 * @param keyProps
 * @param action
 */
export declare function editableRowByKey<T>(keyProps: {
    data: T[];
    childrenColumnName: string;
    getRowKey: ProTableGetRowKey<T>;
    key: KeyType;
    row: T;
}, action: 'update' | 'top' | 'delete'): T[];
type FindNextColumnParams<T extends ProComponentObject> = {
    columns: ProColumns<T>;
    currentColumn?: ProColumn<T>;
};
export declare const findNextColumn: <T extends ProComponentObject>({ columns, currentColumn, }: FindNextColumnParams<T>) => ProColumn<T> | undefined;
type ProEnterParams<T extends ProComponentObject> = {
    columns: ProColumns<T>;
    editContext: ProTableEditContext<T>;
    rowData: T;
    currentColumn?: ProColumn<T>;
    hasEnter?: boolean;
};
export declare const handleEnter: <T extends ProComponentObject>(enterParams: ProEnterParams<T>) => void;
export declare const setColumnInstance: <T extends ProComponentObject>(rowData: T, columnKey: string, editContext: ProTableEditContext<T>, columns: ProColumns<T>) => void;
export {};
