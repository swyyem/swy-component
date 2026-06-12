import { ref } from 'vue';
import type { UploadProps, ButtonProps } from 'element-plus';
import type { PropType } from 'vue';
import type { ModelProps } from '../../tool/upload';
interface unloadProp extends UploadProps {
    'file-list'?: unknown[];
    limitSize?: number;
    'onUpdate:modelValue'?: (value: ModelProps) => void;
}
interface ButtonProp extends ButtonProps {
    title?: string;
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    title: {
        type: PropType<string>;
        default: () => string;
    };
    fieldProps: {
        type: PropType<unloadProp>;
        required: true;
    };
    mode: {
        type: PropType<string>;
        required: true;
    };
    buttonProps: {
        type: PropType<ButtonProp>;
        default: () => {
            type: string;
            text: boolean;
            title: string;
        };
    };
    modelValue: {
        type: PropType<ModelProps>;
        default: () => {
            createFileMetadataList: never[];
            deleteFileMetadataList: never[];
        };
    };
    defaultBusinessType: {
        type: PropType<string | number>;
        default: () => string;
    };
    childRef: {
        type: PropType<typeof ref>;
        default: () => import("vue").Ref<null, null>;
    };
    onSave: {
        type: PropType<(fileList: any[], success: boolean) => void>;
        default: () => void;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    title: {
        type: PropType<string>;
        default: () => string;
    };
    fieldProps: {
        type: PropType<unloadProp>;
        required: true;
    };
    mode: {
        type: PropType<string>;
        required: true;
    };
    buttonProps: {
        type: PropType<ButtonProp>;
        default: () => {
            type: string;
            text: boolean;
            title: string;
        };
    };
    modelValue: {
        type: PropType<ModelProps>;
        default: () => {
            createFileMetadataList: never[];
            deleteFileMetadataList: never[];
        };
    };
    defaultBusinessType: {
        type: PropType<string | number>;
        default: () => string;
    };
    childRef: {
        type: PropType<typeof ref>;
        default: () => import("vue").Ref<null, null>;
    };
    onSave: {
        type: PropType<(fileList: any[], success: boolean) => void>;
        default: () => void;
    };
}>> & Readonly<{}>, {
    title: string;
    modelValue: ModelProps;
    buttonProps: ButtonProp;
    childRef: typeof ref;
    defaultBusinessType: string | number;
    onSave: (fileList: any[], success: boolean) => void;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
