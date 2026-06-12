import type { VNode, PropType } from 'vue';
export declare const RenderCustom: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    content: {
        type: PropType<() => VNode | VNode[] | null>;
        required: true;
    };
}>, () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}> | VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[] | null, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    content: {
        type: PropType<() => VNode | VNode[] | null>;
        required: true;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
