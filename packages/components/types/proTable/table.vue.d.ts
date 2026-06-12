import type { ProComponentObject, ProComponentAny } from '../common.types';
import type { ProTableProps } from './proTable.types';
declare const _default: <OriginT extends ProComponentObject>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{} & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, never> & ProTableProps<OriginT & {
        _proKey?: string;
    }> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{
        resize: () => void;
        setCurrentRow: (row: OriginT & {
            _proKey?: string;
        }, isEmit?: boolean) => void;
        getSelectionRows: () => (OriginT & {
            _proKey?: string;
        })[];
        setScrollTop: import("./table.types").ProTableContentInstance<T>["setScrollTop"];
        setLoading: (v: boolean) => void;
        getData: () => (OriginT & {
            _proKey?: string;
        })[];
        getDataHasKey: () => (OriginT & {
            _proKey?: string;
        })[];
        getTableDataSize: () => number;
        refresh: (v?: boolean) => Promise<ProComponentAny>;
        onSearch: (params?: ProComponentObject) => Promise<ProComponentAny>;
        onCurrentSearch: (params?: ProComponentObject) => void;
        selectFetch: (cb: () => void) => void;
        setSearchForm: (data: ProComponentObject) => void;
        getSearchForm: () => ProComponentObject;
        setTableData: (data: (OriginT & {
            _proKey?: string;
        })[], isCover?: boolean) => void;
        setData: (data: (OriginT & {
            _proKey?: string;
        })[], isCover?: boolean) => void;
        setDataClad: (data: (OriginT & {
            _proKey?: string;
        }) | (OriginT & {
            _proKey?: string;
        })[]) => void;
        navigateRow: (dir: import("./table.types").ProTableRowDirection) => void;
        setNavigateRow: () => (OriginT & {
            _proKey?: string;
        }) | undefined;
        updateRow: () => void;
        actions: {
            exportMethod: (options?: import("./table.types").ProTableToolbarExportProps) => Promise<ProComponentAny>;
            importMethod: (file: Blob, options?: import("./table.types").ProTableToolbarImportProps<OriginT & {
                _proKey?: string;
            }> | undefined) => Promise<ProComponentAny>;
            add: (rowData?: (OriginT & {
                _proKey?: string;
            }) | undefined) => void;
            delete: (rowData: OriginT & {
                _proKey?: string;
            }) => void;
        };
        getRowIsLocal: (row: OriginT & {
            _proKey?: string;
        }) => boolean;
        setColumnPosition: (rowData: OriginT & {
            _proKey?: string;
        }, columnKey: string) => void;
        getFormInstances: () => Record<string, ProComponentAny>[];
        getFormInstanceByKey: (key: string, rowData: OriginT & {
            _proKey?: string;
        }) => ProComponentAny;
        validate: (cb?: import("./table.types").ProTableFormValidateType) => Promise<boolean>;
        getFormData: () => (OriginT & {
            _proKey?: string;
        })[] | undefined;
        getFormRecord: () => import("./table.types").ProRecordDataType<OriginT & {
            _proKey?: string;
        }>;
        resetForm: (data: (OriginT & {
            _proKey?: string;
        })[]) => void;
    }>): void;
    attrs: any;
    slots: {
        [x: number]: ((props: any) => any) | undefined;
    } & {
        [x: number]: ((props: any) => any) | undefined;
    };
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
