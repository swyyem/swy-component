import type { ProInputTagProps } from './tag.types';
declare const _default: import("vue").DefineComponent<ProInputTagProps, {
    focus: () => void;
    blur: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:modelValue": (val: any[]) => any;
    "remove-tag": (val: any) => any;
}, string, import("vue").PublicProps, Readonly<ProInputTagProps> & Readonly<{
    "onUpdate:modelValue"?: ((val: any[]) => any) | undefined;
    "onRemove-tag"?: ((val: any) => any) | undefined;
}>, {
    effect: import("element-plus").SelectProps["effect"];
    popperClass: string;
    fitInputWidth: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
