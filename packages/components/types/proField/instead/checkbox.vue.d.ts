import type { ProSingleCheckboxProps } from '../index.type';
export type ProCheckboxEmits = {
    (e: 'update:modelValue', val: ProSingleCheckboxProps['modelValue']): void;
    (e: 'focus', v: FocusEvent): void;
    (e: 'blur', v: FocusEvent): void;
    (e: 'keydown', v: KeyboardEvent): void;
    (e: 'change', v: ProSingleCheckboxProps['modelValue']): void;
    (e: 'click', v: MouseEvent): void;
};
declare var __VLS_11: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_11) => any;
};
declare const __VLS_component: import("vue").DefineComponent<ProSingleCheckboxProps, {
    focus: () => void;
    blur: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    focus: (v: FocusEvent) => any;
    blur: (v: FocusEvent) => any;
    change: (v: string | number | boolean | undefined) => any;
    click: (v: MouseEvent) => any;
    keydown: (v: KeyboardEvent) => any;
    "update:modelValue": (val: string | number | boolean | undefined) => any;
}, string, import("vue").PublicProps, Readonly<ProSingleCheckboxProps> & Readonly<{
    onFocus?: ((v: FocusEvent) => any) | undefined;
    onBlur?: ((v: FocusEvent) => any) | undefined;
    onChange?: ((v: string | number | boolean | undefined) => any) | undefined;
    onClick?: ((v: MouseEvent) => any) | undefined;
    onKeydown?: ((v: KeyboardEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((val: string | number | boolean | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
