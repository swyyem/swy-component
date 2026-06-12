import { ref } from 'vue';
import type { MentionProps } from 'element-plus';
import type { PropType } from 'vue';
import type { ProSchemaValueEnumType, ProFieldRequestData } from '../index.type';
import type { TextSpecifiledProps } from './text/type';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<MentionProps>;
        required: true;
    };
    textProps: {
        type: PropType<Omit<TextSpecifiledProps, "copyText">>;
    };
    mode: {
        type: PropType<string>;
        required: true;
    };
    modelValue: {
        type: PropType<string>;
        default: () => string;
    };
    emptyText: {
        type: PropType<string>;
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
        type: PropType<MentionProps>;
        required: true;
    };
    textProps: {
        type: PropType<Omit<TextSpecifiledProps, "copyText">>;
    };
    mode: {
        type: PropType<string>;
        required: true;
    };
    modelValue: {
        type: PropType<string>;
        default: () => string;
    };
    emptyText: {
        type: PropType<string>;
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
    modelValue: string;
    valueEnum: ProSchemaValueEnumType[];
    debounceTime: number;
    childRef: typeof ref;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
