import { type Ref } from 'vue';
import { type ProFormInstance } from '../index.ts';
import type { ProComponentObject } from '../common.types';
import type { FormDialogType } from './dialog.types.ts';
declare const _default: <T extends ProComponentObject>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onRefresh?: ((...args: any[]) => any) | undefined;
        readonly "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onUpdate:modelValue" | "onRefresh"> & FormDialogType<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{
        ProFormRef: Ref<ProFormInstance<T> | undefined, ProFormInstance<T> | undefined>;
        ProDialogRef: Ref<any, any>;
    }>): void;
    attrs: any;
    slots: {
        'dialog-header'?: (props: {}) => any;
    } & {
        'dialog-footer'?: (props: {}) => any;
    } & {
        footer?: (props: {}) => any;
    };
    emit: (event: "refresh" | "update:modelValue", ...args: any[]) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
