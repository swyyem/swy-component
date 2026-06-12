import type { CSSProperties } from 'vue';
import type { ProComponentObject } from '../common.types';
import type { ProColumn, ProTableFieldProps, ProCellRendererParams, ProTableGetRowKey } from './table.types';
import type { TextSpecifiledProps, ElTextProps } from '../proField/components/text/type';
import type { ProFieldValueType } from '../proField/index.type';
export type ProTableCellProps<T extends ProComponentObject, ValueType extends ProFieldValueType = ProFieldValueType> = ProCellRendererParams<T> & Pick<ProColumn<T>, 'required' | 'editable' | 'cellRenderer' | 'editCellRenderer'> & Omit<TextSpecifiledProps, 'copyText'> & Pick<ElTextProps, 'lineClamp'> & ProTableFieldProps<ValueType> & {
    class?: string;
    style?: CSSProperties;
    editing?: boolean;
    onClick?: () => void;
    onDoubleClick?: () => void;
    onBlur?: () => void;
    'onKeydown:enter'?: () => void;
    getRowKey: ProTableGetRowKey<T>;
};
declare const _default: <T extends ProComponentObject>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{} & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, never> & ProTableCellProps<T, ProFieldValueType> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: {};
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
