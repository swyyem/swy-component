import { ref } from 'vue';
import type { SegmentedProps } from 'element-plus';
import type { PropType } from 'vue';
import type { ProSchemaValueEnumType, ProFieldRequestData } from '../index.type';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<SegmentedProps>;
        required: true;
    };
    mode: {
        type: PropType<string>;
        required: true;
    };
    request: {
        type: PropType<ProFieldRequestData>;
    };
    valueEnum: {
        type: PropType<ProSchemaValueEnumType[]>;
        default: () => never[];
    };
    params: {
        type: PropType<object | number | string>;
    };
    debounceTime: {
        type: NumberConstructor;
        default: () => number;
    };
    childRef: {
        type: PropType<typeof ref>;
        default: () => import("vue").Ref<null, null>;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<SegmentedProps>;
        required: true;
    };
    mode: {
        type: PropType<string>;
        required: true;
    };
    request: {
        type: PropType<ProFieldRequestData>;
    };
    valueEnum: {
        type: PropType<ProSchemaValueEnumType[]>;
        default: () => never[];
    };
    params: {
        type: PropType<object | number | string>;
    };
    debounceTime: {
        type: NumberConstructor;
        default: () => number;
    };
    childRef: {
        type: PropType<typeof ref>;
        default: () => import("vue").Ref<null, null>;
    };
}>> & Readonly<{}>, {
    valueEnum: ProSchemaValueEnumType[];
    debounceTime: number;
    childRef: typeof ref;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
