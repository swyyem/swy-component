import { type VNode } from 'vue';
import type { ProComponentObject } from '../common.types';
import type { ProBaseTableProps, ProBaseTableInstance, ProTableProviderProps, ProTableEmits } from './table.types';
declare const _default: <OriginT extends ProComponentObject>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly "onMenu-click"?: ((val: import("./table.types").ProTableMenuClickParams<OriginT & {
            _proKey?: string;
        }>) => any) | undefined;
        readonly "onData-change"?: ((v: (OriginT & {
            _proKey?: string;
        })[]) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onMenu-click" | "onData-change"> & ProBaseTableProps<OriginT & {
        _proKey?: string;
    }> & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<ProBaseTableInstance<OriginT & {
        _proKey?: string;
    }>>): void;
    attrs: any;
    slots: {
        'column-operating': (props: {
            actions: ProTableProviderProps<OriginT & {
                _proKey?: string;
            }>["actions"];
        }) => VNode[];
        expand: (props: {
            row: OriginT & {
                _proKey?: string;
            };
            column: ProComponentObject;
            $index: number;
        }) => VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }> | VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>[];
        default: (v: ProComponentObject) => VNode[];
        'toolbar-filters': (onSearch: (params?: ProComponentObject) => void, searchForm: ProComponentObject) => VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }> | VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>[];
        'toolbar-search': (onSearch: (params?: ProComponentObject) => void, searchForm: ProComponentObject) => VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }> | VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>[];
        'toolbar-buttons': (onSearch: (params?: ProComponentObject) => void, searchForm: ProComponentObject) => VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }> | VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>[];
        'table-side': () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }> | VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>[];
        'body-bottom': () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }> | VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }>[];
    };
    emit: ProTableEmits<OriginT & {
        _proKey?: string;
    }>;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
