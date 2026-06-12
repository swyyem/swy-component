import { type Ref } from 'vue';
import type { CheckboxValueType } from 'element-plus';
import type { ProSelectDefaultProps, ProSelectEmits } from './select.types';
import type { ProSchemaValueEnumType } from '../proField';
export declare const useCheck: (props: ProSelectDefaultProps, emit: ProSelectEmits, options: {
    valueEnum: Ref<ProSchemaValueEnumType[]>;
    getOptionDataList: (v?: CheckboxValueType[]) => ProSchemaValueEnumType[];
}) => {
    checkStatus: import("vue").ComputedRef<boolean | undefined>;
    handleCheckAll: (val: CheckboxValueType) => void;
    checkAll: Ref<boolean, boolean>;
    checkIndeterminate: Ref<boolean, boolean>;
};
