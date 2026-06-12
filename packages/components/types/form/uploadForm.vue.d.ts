import type { ModalFormProps } from './modalForm.types';
interface Props extends ModalFormProps {
    fileList?: any[];
    trigger?: any;
    open?: boolean;
    onOpenChange?: (val: boolean) => void;
    addressPrefix?: string;
}
declare var __VLS_15: {}, __VLS_131: {}, __VLS_133: {};
type __VLS_Slots = {} & {
    trigger?: (props: typeof __VLS_15) => any;
} & {
    empty?: (props: typeof __VLS_131) => any;
} & {
    default?: (props: typeof __VLS_133) => any;
};
declare const __VLS_component: import("vue").DefineComponent<Props, {
    formRef: import("vue").Ref<any, any>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: (value: any) => any;
    refresh: (value: any) => any;
    "update:open": (value: boolean) => any;
    deleteLocal: (value: any) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onClose?: ((value: any) => any) | undefined;
    onRefresh?: ((value: any) => any) | undefined;
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
    onDeleteLocal?: ((value: any) => any) | undefined;
}>, {
    open: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
