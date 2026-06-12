import type { ProFieldPropsType } from './index.type';
type __VLS_Props = ProFieldPropsType;
declare const _default: import("vue").DefineComponent<__VLS_Props, {
    getText: (val: any) => any;
    getControlRef: () => any;
    childRef: any;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (...args: any[]) => void;
    "keydown:enter": (...args: any[]) => void;
    "update:option": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    "onKeydown:enter"?: ((...args: any[]) => any) | undefined;
    "onUpdate:option"?: ((...args: any[]) => any) | undefined;
}>, {
    mode: import("./index.type").ProFieldFCMode;
    emptyText: string;
    valueType: import("./index.type").ProFieldValueType;
    fieldProps: any;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
