/**
 * required 统一放入 rules 中处理
 * 默认 message 取 label 加上不能为空
 */
import type { ProComponentObject } from '../common.types';
import type { PropFormFieldProps, ProFormFieldInstance } from './form.types';
declare const _default: <T extends ProComponentObject>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly "onUpdate:label"?: ((value: string) => any) | undefined;
        readonly "onUpdate:required"?: ((value: boolean) => any) | undefined;
        readonly "onUpdate:rules"?: ((value: import("element-plus/es/utils/typescript.mjs").Arrayable<import("element-plus").FormItemRule> | undefined) => any) | undefined;
        readonly "onUpdate:params"?: ((value: string | string[] | undefined) => any) | undefined;
        readonly "onUpdate:valueEnum"?: ((value: (string | import("..").ProSchemaValueEnumType)[] | undefined) => any) | undefined;
        readonly "onUpdate:fieldProps"?: ((value: any) => any) | undefined;
        readonly "onUpdate:display"?: ((value: import("./form.types").DisplayEnum | undefined) => any) | undefined;
        readonly "onKeydown:enter"?: ((value: string) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onKeydown:enter" | "onUpdate:label" | "onUpdate:required" | "onUpdate:rules" | "onUpdate:params" | "onUpdate:valueEnum" | "onUpdate:fieldProps" | "onUpdate:display"> & PropFormFieldProps & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<ProFormFieldInstance>): void;
    attrs: any;
    slots: {};
    emit: ((evt: "update:label", value: string) => void) & ((evt: "update:required", value: boolean) => void) & ((evt: "update:rules", value: import("element-plus/es/utils/typescript.mjs").Arrayable<import("element-plus").FormItemRule> | undefined) => void) & ((evt: "update:params", value: string | string[] | undefined) => void) & ((evt: "update:valueEnum", value: (string | import("..").ProSchemaValueEnumType)[] | undefined) => void) & ((evt: "update:fieldProps", value: any) => void) & ((evt: "update:display", value: import("./form.types").DisplayEnum | undefined) => void) & ((evt: "keydown:enter", value: string) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
