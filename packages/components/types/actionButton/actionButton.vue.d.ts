import type { ProComponentObject } from '../common.types';
import { type Ref } from 'vue';
import type { ActionButtonProps } from './actionButton.types';
declare const _default: <T extends ProComponentObject>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{} & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, never> & ActionButtonProps<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{
        visible: Ref<boolean, boolean>;
        FormDialogRef: Ref<any, any>;
        getFormRef: () => any;
    }>): void;
    attrs: any;
    slots: {
        [x: string]: ((props: any) => any) | undefined;
    } & {
        button?: (props: {}) => any;
    };
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
