import type { ProComponentObject } from '../../common.types';
import type { ProTableProviderProps, ProTableToolbarExportProps, ProTableToolbarImportProps } from '../table.types';
type ExportOptions<T extends ProComponentObject> = ProTableToolbarExportProps & {
    getSelectionRows: ProTableProviderProps<T>['getSelectionRows'];
    pureFetch: ProTableProviderProps<T>['pureFetch'];
    columns: ProTableProviderProps<T>['columns'];
    getCellRef: ProTableProviderProps<T>['getCellRef'];
    getTableData: ProTableProviderProps<T>['getTableData'];
};
export declare const exportMethod: <T extends ProComponentObject = ProComponentObject>(options: ExportOptions<T>) => Promise<ProComponentObject[]>;
export declare const importMethod: <T extends ProComponentObject = ProComponentObject>(file: Blob, options?: ProTableToolbarImportProps<T>) => Promise<any[]>;
export {};
