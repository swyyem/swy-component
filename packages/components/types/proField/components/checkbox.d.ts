import type { PropType } from 'vue';
import type { ProSchemaValueEnumType, ProSchemaValueEnumValue, ProFieldRequestData, ProCheckboxProps } from '../index.type';
import type { TextSpecifiledProps } from './text/type';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<Partial<ProCheckboxProps>>;
        required: true;
    };
    textProps: {
        type: PropType<Omit<TextSpecifiledProps, "copyText">>;
    };
    emptyText: {
        type: PropType<string>;
    };
    mode: {
        type: PropType<string>;
        required: true;
    };
    modelValue: {
        type: PropType<ProSchemaValueEnumValue[] | ProSchemaValueEnumValue>;
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
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:modelValue" | "keydown:enter")[], "update:modelValue" | "keydown:enter", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<Partial<ProCheckboxProps>>;
        required: true;
    };
    textProps: {
        type: PropType<Omit<TextSpecifiledProps, "copyText">>;
    };
    emptyText: {
        type: PropType<string>;
    };
    mode: {
        type: PropType<string>;
        required: true;
    };
    modelValue: {
        type: PropType<ProSchemaValueEnumValue[] | ProSchemaValueEnumValue>;
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
}>> & Readonly<{
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    "onKeydown:enter"?: ((...args: any[]) => any) | undefined;
}>, {
    valueEnum: ProSchemaValueEnumType[];
    debounceTime: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
