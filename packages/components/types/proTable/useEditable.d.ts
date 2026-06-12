import type { ProComponentObject } from '../common.types';
import type { ProColumns } from './table.types';
import type { ProTableEditContext } from './proTableEdit.types';
export declare function useEditable<T extends ProComponentObject>(editContext: ProTableEditContext<T>): {
    transformEditableColumns: (columns: ProColumns<T>) => ProColumns<T>;
    operateMethods: {
        edit: (rowData: T) => void;
        delete: (rowData: T) => void;
        cancel: (rowData: T) => void;
        save: (rowData: T) => void;
        add: (rowData?: T) => void;
    };
};
