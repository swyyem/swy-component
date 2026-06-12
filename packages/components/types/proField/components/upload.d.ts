import type { UploadProps, ButtonProps } from 'element-plus';
import type { PropType } from 'vue';
interface UploadProp extends UploadProps {
    'file-list'?: unknown[];
    limitSize?: number;
    'onUpdate:modelValue'?: (value: any) => void;
}
interface ButtonProp extends ButtonProps {
    label?: string;
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<UploadProp>;
        required: true;
    };
    uploadButtonProps: {
        type: PropType<ButtonProp>;
        default: () => {
            label: string;
            plain: boolean;
            type: string;
        };
    };
    mode: {
        type: PropType<"read" | "edit" | "update">;
        required: true;
    };
    modelValue: {
        type: PropType<object | Array<any>>;
        default: () => {};
    };
    childRef: {
        type: PropType<any>;
        default: null;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    fieldProps: {
        type: PropType<UploadProp>;
        required: true;
    };
    uploadButtonProps: {
        type: PropType<ButtonProp>;
        default: () => {
            label: string;
            plain: boolean;
            type: string;
        };
    };
    mode: {
        type: PropType<"read" | "edit" | "update">;
        required: true;
    };
    modelValue: {
        type: PropType<object | Array<any>>;
        default: () => {};
    };
    childRef: {
        type: PropType<any>;
        default: null;
    };
}>> & Readonly<{}>, {
    modelValue: object | any[];
    childRef: any;
    uploadButtonProps: ButtonProp;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
