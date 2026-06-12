import { ref } from 'vue';
import type { PropType } from 'vue';
import type { ProTableProps } from '../../proTable/proTable.types';
import type { TableRequest, AnyObject } from '../../proTable/table.types';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<ProTableProps>;
        required: true;
    };
    mode: {
        type: PropType<string>;
        required: true;
    };
    emptyText: {
        type: PropType<string>;
    };
    modelValue: {
        type: PropType<any[]>;
    };
    request: {
        type: PropType<TableRequest<AnyObject>>;
    };
    childRef: {
        type: PropType<typeof ref>;
        default: () => import("vue").Ref<null, null>;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<ProTableProps>;
        required: true;
    };
    mode: {
        type: PropType<string>;
        required: true;
    };
    emptyText: {
        type: PropType<string>;
    };
    modelValue: {
        type: PropType<any[]>;
    };
    request: {
        type: PropType<TableRequest<AnyObject>>;
    };
    childRef: {
        type: PropType<typeof ref>;
        default: () => import("vue").Ref<null, null>;
    };
}>> & Readonly<{}>, {
    childRef: typeof ref;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
