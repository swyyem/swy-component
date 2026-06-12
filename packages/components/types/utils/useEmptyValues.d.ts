import type { ExtractPropTypes, InjectionKey, Ref } from 'vue';
type EmptyValuesContext = ExtractPropTypes<typeof useEmptyValuesProps>;
export declare const emptyValuesContextKey: InjectionKey<Ref<EmptyValuesContext>>;
export declare const SCOPE = "use-empty-values";
export declare const DEFAULT_EMPTY_VALUES: (string | null | undefined)[];
export declare const DEFAULT_VALUE_ON_CLEAR: undefined;
export declare const useEmptyValuesProps: any;
export declare const useEmptyValues: (props: EmptyValuesContext, defaultValue?: null | undefined) => {
    emptyValues: import("vue").ComputedRef<any>;
    valueOnClear: import("vue").ComputedRef<any>;
    isEmptyValue: (value: any) => any;
};
export {};
