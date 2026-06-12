import { type cascaderProps } from 'element-plus';
import { ref } from 'vue';
import type { PropType, ExtractPropTypes } from 'vue';
import type { ProSchemaValueEnumType, ProFieldRequestData } from '../index.type';
import type { TextSpecifiledProps } from './text/type';
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    fieldProps: {
        type: PropType<ExtractPropTypes<typeof cascaderProps>>;
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
        type: PropType<string | number | (string | number)[]>;
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
        type: (ObjectConstructor | StringConstructor | NumberConstructor)[];
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
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    fieldProps: {
        type: PropType<ExtractPropTypes<typeof cascaderProps>>;
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
        type: PropType<string | number | (string | number)[]>;
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
        type: (ObjectConstructor | StringConstructor | NumberConstructor)[];
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
    modelValue: string | number | (string | number)[];
    valueEnum: ProSchemaValueEnumType[];
    debounceTime: number;
    childRef: typeof ref;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
