import { type DatePickerProps } from 'element-plus';
import { type PropType } from 'vue';
export declare const ProDatePickerProps: {
    fieldProps: {
        type: PropType<DatePickerProps>;
        required: boolean;
    };
    mode: {
        type: PropType<string>;
        required: boolean;
    };
    emptyText: {
        type: PropType<string>;
    };
    modelValue: {
        type: PropType<string | number | Date | Array<Date | string | number>>;
    };
};
export type ProDatePickerPropsType = {
    fieldProps: DatePickerProps;
    mode: string;
    emptyText?: string;
    modelValue?: string | number | Date | string[] | number[] | Date[];
};
declare const _default: import("vue").DefineComponent<ProDatePickerPropsType, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProDatePickerPropsType> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
