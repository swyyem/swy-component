import { type TimePickerDefaultProps } from 'element-plus';
import { type PropType } from 'vue';
import type { TextSpecifiledProps } from './text/type';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<TimePickerDefaultProps>;
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
        type: PropType<string | number | Date | Array<Date | string | number>>;
        default: () => string;
    };
    emptyText: {
        type: PropType<string>;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<TimePickerDefaultProps>;
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
        type: PropType<string | number | Date | Array<Date | string | number>>;
        default: () => string;
    };
    emptyText: {
        type: PropType<string>;
    };
}>> & Readonly<{}>, {
    modelValue: string | number | Date | (string | number | Date)[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
