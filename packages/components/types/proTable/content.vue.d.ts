import type { ProComponentObject, ProComponentAny } from '../common.types';
import type { ProTableContentProps, ProTableContentInstance } from './table.types';
declare const _default: <T extends ProComponentObject>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly "onCurrent-change"?: ((row: T | null, oldRow: T | null) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onCurrent-change"> & ProTableContentProps<T> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<ProTableContentInstance<T>>): void;
    attrs: any;
    slots: {
        expand: (props: {
            row: T;
            column: ProComponentAny;
            $index: number;
        }) => ProComponentAny;
        empty: () => ProComponentAny;
    };
    emit: (evt: "current-change", row: T | null, oldRow: T | null) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
