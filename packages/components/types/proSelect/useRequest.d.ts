import { type Ref } from 'vue';
import type { ProTablePageParams } from '../proTable/table.types';
import type { ProSchemaValueEnumType } from '../proField';
import type { ProSelectEnhanceProps } from './select.types';
export declare const useRequest: (options: {
    valueKey: string;
    request?: ProSelectEnhanceProps["remoteMethod"];
    params: Ref<ProSelectEnhanceProps["params"]>;
    waterfall?: ProSelectEnhanceProps["waterfall"];
    manualRequest?: boolean;
    defaultValueEnum?: ProSelectEnhanceProps["defaultValueEnum"];
    valueEnum?: Ref<ProSelectEnhanceProps["valueEnum"]>;
    handleValueEnumChange?: ProSelectEnhanceProps["handleValueEnumChange"];
}) => {
    loading: Ref<boolean, boolean>;
    first: Ref<boolean, boolean>;
    valueEnum: import("vue").ShallowRef<ProSchemaValueEnumType[], ProSchemaValueEnumType[]>;
    pageInfo: {
        currentPage?: number | undefined;
        pageSize?: number | undefined;
        total?: number | undefined;
        scrollId?: string | undefined;
        hasMore?: boolean | undefined;
    };
    onFetch: (v?: any) => void;
    setPage: (changedPage: ProTablePageParams) => void;
    resetPage: () => void;
    resetRequest: () => void;
    getRealValue: (item: ProSchemaValueEnumType) => any;
};
