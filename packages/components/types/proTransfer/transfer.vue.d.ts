import type { ProComponentObject } from '../common.types';
import type { ProTransferProps, ProTransferValueType, ProTransferDirection } from './transfer.types';
declare const _default: <T extends ProComponentObject>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onChange?: ((value: ProTransferValueType, direction: ProTransferDirection, movedKeys: ProTransferValueType) => any) | undefined;
        readonly "onUpdate:modelValue"?: ((value: ProTransferValueType) => any) | undefined;
        readonly "onLeft-check-change"?: ((value: ProTransferValueType) => any) | undefined;
        readonly "onRight-check-change"?: ((value: ProTransferValueType) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onChange" | "onUpdate:modelValue" | "onLeft-check-change" | "onRight-check-change"> & ProTransferProps<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: {};
    emit: ((evt: "change", value: ProTransferValueType, direction: ProTransferDirection, movedKeys: ProTransferValueType) => void) & ((evt: "update:modelValue", value: ProTransferValueType) => void) & ((evt: "left-check-change", value: ProTransferValueType) => void) & ((evt: "right-check-change", value: ProTransferValueType) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
