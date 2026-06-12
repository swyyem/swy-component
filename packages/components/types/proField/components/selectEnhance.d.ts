import type { PropType } from 'vue';
import { type ProSelectDefaultProps } from '../../proSelect';
import type { ProSchemaValueEnumType } from '../index.type';
import type { TextSpecifiledProps } from './text/type';
type OptionDataType = {
    label: string;
    value: any;
};
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<ProSelectDefaultProps>;
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
        type: PropType<string | number | boolean | object | Array<string | number | object>>;
    };
    optionData: {
        type: PropType<OptionDataType>;
    };
    emptyText: {
        type: PropType<string>;
    };
    params: {
        type: PropType<object>;
    };
    valueEnum: {
        type: PropType<ProSchemaValueEnumType[]>;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<ProSelectDefaultProps>;
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
        type: PropType<string | number | boolean | object | Array<string | number | object>>;
    };
    optionData: {
        type: PropType<OptionDataType>;
    };
    emptyText: {
        type: PropType<string>;
    };
    params: {
        type: PropType<object>;
    };
    valueEnum: {
        type: PropType<ProSchemaValueEnumType[]>;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
