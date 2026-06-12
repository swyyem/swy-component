import { ref } from 'vue';
import type { AutocompleteProps } from 'element-plus';
import type { PropType } from 'vue';
import type { TextSpecifiledProps } from './text/type';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<AutocompleteProps>;
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
        type: PropType<string>;
        default: () => string;
    };
    childRef: {
        type: PropType<typeof ref>;
        default: () => import("vue").Ref<null, null>;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<AutocompleteProps>;
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
        type: PropType<string>;
        default: () => string;
    };
    childRef: {
        type: PropType<typeof ref>;
        default: () => import("vue").Ref<null, null>;
    };
}>> & Readonly<{}>, {
    modelValue: string;
    childRef: typeof ref;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
