import { ref, type PropType } from 'vue';
import type { ProSchemaValueEnumType, ProFieldRequestData } from '../index.type';
import type { TextSpecifiledProps } from './text/type';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: ObjectConstructor;
        required: true;
    };
    textProps: {
        type: PropType<Omit<TextSpecifiledProps, "copyText">>;
    };
    mode: {
        type: PropType<string>;
        required: true;
    };
    emptyText: {
        type: PropType<string>;
    };
    modelValue: {
        type: PropType<string | number | boolean | object | Array<string | number | object>>;
        default: () => string;
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
        type: ObjectConstructor;
        required: true;
    };
    textProps: {
        type: PropType<Omit<TextSpecifiledProps, "copyText">>;
    };
    mode: {
        type: PropType<string>;
        required: true;
    };
    emptyText: {
        type: PropType<string>;
    };
    modelValue: {
        type: PropType<string | number | boolean | object | Array<string | number | object>>;
        default: () => string;
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
    modelValue: string | number | boolean | object | (string | number | object)[];
    valueEnum: ProSchemaValueEnumType[];
    debounceTime: number;
    childRef: typeof ref;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
