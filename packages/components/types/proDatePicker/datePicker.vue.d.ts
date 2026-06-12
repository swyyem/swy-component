import type { ProDatePickerProps } from './datePicker.data';
declare function handleFocus(e?: FocusEvent): void;
declare function removeFocusClass(e: FocusEvent): void;
declare const _default: import("vue").DefineComponent<ProDatePickerProps, {
    addFocusClass: typeof handleFocus;
    removeFocusClass: typeof removeFocusClass;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    keydown: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
    "keydown:enter": (...args: any[]) => void;
    isFocus: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<ProDatePickerProps> & Readonly<{
    onKeydown?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    "onKeydown:enter"?: ((...args: any[]) => any) | undefined;
    onIsFocus?: ((...args: any[]) => any) | undefined;
}>, {
    readonly clearable: import("element-plus/es/utils/index.mjs").EpPropMergeType<BooleanConstructor, unknown, unknown>;
    hasIcon: boolean;
    showCalendarIcon: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
