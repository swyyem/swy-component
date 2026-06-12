import type { PropType } from 'vue';
import type { ProSchemaValueEnumType, ProFieldRequestData, ProRadioGroupProps } from '../index.type';
import type { TextSpecifiledProps } from './text/type';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<ProRadioGroupProps>;
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
        type: PropType<string | number | boolean>;
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
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<ProRadioGroupProps>;
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
        type: PropType<string | number | boolean>;
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
}>> & Readonly<{}>, {
    modelValue: string | number | boolean;
    valueEnum: ProSchemaValueEnumType[];
    debounceTime: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
