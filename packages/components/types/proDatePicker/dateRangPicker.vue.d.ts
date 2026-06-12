import type { ProDatePickerProps } from './datePicker.data';
declare const _default: import("vue").DefineComponent<ProDatePickerProps, {
    addFocusClass: () => void;
    removeFocusClass: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (...args: any[]) => void;
    "keydown:enter": (...args: any[]) => void;
    isFocus: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<ProDatePickerProps> & Readonly<{
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    "onKeydown:enter"?: ((...args: any[]) => any) | undefined;
    onIsFocus?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
