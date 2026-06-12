import type { ProComponentObject } from '../common.types';
import type { ProFormInstance, ProFormProps, ProFormEmits } from './form.types';
declare const _default: <T extends ProComponentObject>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onReset?: ((v: MouseEvent) => any) | undefined;
        readonly onSubmit?: ((v: T) => any) | undefined;
        readonly "onUpdate:modelValue"?: ((val: T) => any) | undefined;
        readonly onFinish?: ((v: T) => any) | undefined;
        readonly onFinishFailed?: ((v: T) => any) | undefined;
        readonly onValuesChange?: ((v: T, allValues: T) => any) | undefined;
        readonly onInit?: ((v: T, form: ProFormInstance<T>) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onReset" | "onSubmit" | "onUpdate:modelValue" | "onFinish" | "onFinishFailed" | "onValuesChange" | "onInit"> & ProFormProps<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<ProFormInstance<T>>): void;
    attrs: any;
    slots: {
        search?: (props: {}) => any;
    } & {
        default?: (props: {}) => any;
    } & {
        default?: (props: {}) => any;
    };
    emit: ProFormEmits<T>;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
