import type { DoneFn, hisDialogProps } from './dialog.types';
declare var __VLS_20: {}, __VLS_22: {};
type __VLS_Slots = {} & {
    'dialog-footer'?: (props: typeof __VLS_20) => any;
} & {
    footer?: (props: typeof __VLS_22) => any;
};
declare const __VLS_component: import("vue").DefineComponent<hisDialogProps, {
    onBeforeClose: (fn: (doneFn?: DoneFn) => void) => Promise<void>;
    closeMessage: (fn?: (doneFn?: DoneFn) => void) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<hisDialogProps> & Readonly<{
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}>, {
    type: import("./dialog.types").Type;
    footer: boolean;
    modelValue: boolean;
    width: string | number;
    appendTo: string | HTMLElement;
    draggable: boolean;
    showClose: boolean;
    destroyOnClose: boolean;
    closeOnClickModal: boolean;
    closeOnPressEscape: boolean;
    lockScroll: boolean;
    modal: boolean;
    hasPadding: boolean;
    dialogType: import("./dialog.types").DialogType;
    inTableRolling: boolean;
    okText: string;
    cancelText: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
