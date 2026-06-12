import { type DatePickerProps } from 'element-plus';
import { type PropType } from 'vue';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<DatePickerProps>;
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
        type: PropType<string | number | Date | Array<Date | string | number>>;
        default: () => string;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<DatePickerProps>;
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
        type: PropType<string | number | Date | Array<Date | string | number>>;
        default: () => string;
    };
}>> & Readonly<{}>, {
    modelValue: string | number | Date | (string | number | Date)[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
