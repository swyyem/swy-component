declare const meta: {
    title: string;
    tags: string[];
    parameters: {
        docs: {
            description: {
                component: string;
            };
        };
    };
};
export default meta;
export declare const Usage: () => {
    setup(): {
        info: import("vue").Ref<string, string>;
    };
    template: string;
};
export declare const Cookie: () => {
    components: {
        ElButton: {
            new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("element-plus").ButtonProps> & Readonly<{
                onClick?: ((evt: MouseEvent) => any) | undefined;
            }>, {
                ref: import("vue").Ref<HTMLButtonElement | undefined, HTMLButtonElement | undefined>;
                size: import("vue").ComputedRef<"" | "default" | "small" | "large">;
                type: import("vue").ComputedRef<"default" | "" | "info" | "primary" | "success" | "warning" | "text" | "danger">;
                disabled: import("vue").ComputedRef<boolean>;
                shouldAddSpace: import("vue").ComputedRef<boolean>;
            }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
                click: (evt: MouseEvent) => void;
            }, import("vue").PublicProps, {
                type: import("element-plus").ButtonType;
                text: boolean;
                disabled: boolean;
                round: boolean;
                dashed: boolean;
                nativeType: import("element-plus").ButtonNativeType;
                loadingIcon: import("element-plus/es/utils/index.mjs").IconPropType;
                plain: boolean;
                autoInsertSpace: boolean;
                tag: string | import("vue").Component;
            }, false, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
                P: {};
                B: {};
                D: {};
                C: {};
                M: {};
                Defaults: {};
            }, Readonly<import("element-plus").ButtonProps> & Readonly<{
                onClick?: ((evt: MouseEvent) => any) | undefined;
            }>, {
                ref: import("vue").Ref<HTMLButtonElement | undefined, HTMLButtonElement | undefined>;
                size: import("vue").ComputedRef<"" | "default" | "small" | "large">;
                type: import("vue").ComputedRef<"default" | "" | "info" | "primary" | "success" | "warning" | "text" | "danger">;
                disabled: import("vue").ComputedRef<boolean>;
                shouldAddSpace: import("vue").ComputedRef<boolean>;
            }, {}, {}, {}, {
                type: import("element-plus").ButtonType;
                text: boolean;
                disabled: boolean;
                round: boolean;
                dashed: boolean;
                nativeType: import("element-plus").ButtonNativeType;
                loadingIcon: import("element-plus/es/utils/index.mjs").IconPropType;
                plain: boolean;
                autoInsertSpace: boolean;
                tag: string | import("vue").Component;
            }>;
            __isFragment?: never;
            __isTeleport?: never;
            __isSuspense?: never;
        } & import("vue").ComponentOptionsBase<Readonly<import("element-plus").ButtonProps> & Readonly<{
            onClick?: ((evt: MouseEvent) => any) | undefined;
        }>, {
            ref: import("vue").Ref<HTMLButtonElement | undefined, HTMLButtonElement | undefined>;
            size: import("vue").ComputedRef<"" | "default" | "small" | "large">;
            type: import("vue").ComputedRef<"default" | "" | "info" | "primary" | "success" | "warning" | "text" | "danger">;
            disabled: import("vue").ComputedRef<boolean>;
            shouldAddSpace: import("vue").ComputedRef<boolean>;
        }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
            click: (evt: MouseEvent) => void;
        }, string, {
            type: import("element-plus").ButtonType;
            text: boolean;
            disabled: boolean;
            round: boolean;
            dashed: boolean;
            nativeType: import("element-plus").ButtonNativeType;
            loadingIcon: import("element-plus/es/utils/index.mjs").IconPropType;
            plain: boolean;
            autoInsertSpace: boolean;
            tag: string | import("vue").Component;
        }, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
            $slots: {
                loading?: (props: {}) => any;
            } & {
                icon?: (props: {}) => any;
            } & {
                default?: (props: {}) => any;
            };
        }) & import("vue").ObjectPlugin & {
            setPropsDefaults: (defaults: Partial<Omit<{
                readonly size?: import("element-plus").ComponentSize | undefined;
                readonly disabled?: boolean | undefined;
                readonly type?: import("element-plus").ButtonType | undefined;
                readonly icon?: import("element-plus/es/utils/index.mjs").IconPropType | undefined;
                readonly nativeType?: import("element-plus").ButtonNativeType | undefined;
                readonly loading?: boolean | undefined;
                readonly loadingIcon?: import("element-plus/es/utils/index.mjs").IconPropType | undefined;
                readonly plain?: boolean | undefined;
                readonly text?: boolean | undefined;
                readonly link?: boolean | undefined;
                readonly bg?: boolean | undefined;
                readonly autofocus?: boolean | undefined;
                readonly round?: boolean | undefined;
                readonly circle?: boolean | undefined;
                readonly dashed?: boolean | undefined;
                readonly color?: string | undefined;
                readonly dark?: boolean | undefined;
                readonly autoInsertSpace?: boolean | undefined;
                readonly tag?: (string | import("vue").Component) | undefined;
                readonly onClick?: ((evt: MouseEvent) => any) | undefined | undefined;
            } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, keyof import("vue").VNodeProps | keyof import("vue").AllowedComponentProps | "onClick">>) => void;
        } & {
            ButtonGroup: {
                new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("element-plus/es/components/button/src/button-group.mjs").ButtonGroupProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
                    type: "" | "default" | "info" | "primary" | "success" | "warning" | "text" | "danger";
                    direction: "horizontal" | "vertical";
                }, false, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
                    P: {};
                    B: {};
                    D: {};
                    C: {};
                    M: {};
                    Defaults: {};
                }, Readonly<import("element-plus/es/components/button/src/button-group.mjs").ButtonGroupProps> & Readonly<{}>, {}, {}, {}, {}, {
                    type: "" | "default" | "info" | "primary" | "success" | "warning" | "text" | "danger";
                    direction: "horizontal" | "vertical";
                }>;
                __isFragment?: never;
                __isTeleport?: never;
                __isSuspense?: never;
            } & import("vue").ComponentOptionsBase<Readonly<import("element-plus/es/components/button/src/button-group.mjs").ButtonGroupProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
                type: "" | "default" | "info" | "primary" | "success" | "warning" | "text" | "danger";
                direction: "horizontal" | "vertical";
            }, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
                $slots: {
                    default?: (props: {}) => any;
                };
            });
        };
    };
    setup(): {
        handleSet: () => void;
        handleGet: () => void;
        handleRemove: () => void;
        ckValue: import("vue").Ref<string, string>;
    };
    template: string;
};
export declare const Storage: () => {
    components: {
        ElButton: {
            new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("element-plus").ButtonProps> & Readonly<{
                onClick?: ((evt: MouseEvent) => any) | undefined;
            }>, {
                ref: import("vue").Ref<HTMLButtonElement | undefined, HTMLButtonElement | undefined>;
                size: import("vue").ComputedRef<"" | "default" | "small" | "large">;
                type: import("vue").ComputedRef<"default" | "" | "info" | "primary" | "success" | "warning" | "text" | "danger">;
                disabled: import("vue").ComputedRef<boolean>;
                shouldAddSpace: import("vue").ComputedRef<boolean>;
            }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
                click: (evt: MouseEvent) => void;
            }, import("vue").PublicProps, {
                type: import("element-plus").ButtonType;
                text: boolean;
                disabled: boolean;
                round: boolean;
                dashed: boolean;
                nativeType: import("element-plus").ButtonNativeType;
                loadingIcon: import("element-plus/es/utils/index.mjs").IconPropType;
                plain: boolean;
                autoInsertSpace: boolean;
                tag: string | import("vue").Component;
            }, false, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
                P: {};
                B: {};
                D: {};
                C: {};
                M: {};
                Defaults: {};
            }, Readonly<import("element-plus").ButtonProps> & Readonly<{
                onClick?: ((evt: MouseEvent) => any) | undefined;
            }>, {
                ref: import("vue").Ref<HTMLButtonElement | undefined, HTMLButtonElement | undefined>;
                size: import("vue").ComputedRef<"" | "default" | "small" | "large">;
                type: import("vue").ComputedRef<"default" | "" | "info" | "primary" | "success" | "warning" | "text" | "danger">;
                disabled: import("vue").ComputedRef<boolean>;
                shouldAddSpace: import("vue").ComputedRef<boolean>;
            }, {}, {}, {}, {
                type: import("element-plus").ButtonType;
                text: boolean;
                disabled: boolean;
                round: boolean;
                dashed: boolean;
                nativeType: import("element-plus").ButtonNativeType;
                loadingIcon: import("element-plus/es/utils/index.mjs").IconPropType;
                plain: boolean;
                autoInsertSpace: boolean;
                tag: string | import("vue").Component;
            }>;
            __isFragment?: never;
            __isTeleport?: never;
            __isSuspense?: never;
        } & import("vue").ComponentOptionsBase<Readonly<import("element-plus").ButtonProps> & Readonly<{
            onClick?: ((evt: MouseEvent) => any) | undefined;
        }>, {
            ref: import("vue").Ref<HTMLButtonElement | undefined, HTMLButtonElement | undefined>;
            size: import("vue").ComputedRef<"" | "default" | "small" | "large">;
            type: import("vue").ComputedRef<"default" | "" | "info" | "primary" | "success" | "warning" | "text" | "danger">;
            disabled: import("vue").ComputedRef<boolean>;
            shouldAddSpace: import("vue").ComputedRef<boolean>;
        }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
            click: (evt: MouseEvent) => void;
        }, string, {
            type: import("element-plus").ButtonType;
            text: boolean;
            disabled: boolean;
            round: boolean;
            dashed: boolean;
            nativeType: import("element-plus").ButtonNativeType;
            loadingIcon: import("element-plus/es/utils/index.mjs").IconPropType;
            plain: boolean;
            autoInsertSpace: boolean;
            tag: string | import("vue").Component;
        }, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
            $slots: {
                loading?: (props: {}) => any;
            } & {
                icon?: (props: {}) => any;
            } & {
                default?: (props: {}) => any;
            };
        }) & import("vue").ObjectPlugin & {
            setPropsDefaults: (defaults: Partial<Omit<{
                readonly size?: import("element-plus").ComponentSize | undefined;
                readonly disabled?: boolean | undefined;
                readonly type?: import("element-plus").ButtonType | undefined;
                readonly icon?: import("element-plus/es/utils/index.mjs").IconPropType | undefined;
                readonly nativeType?: import("element-plus").ButtonNativeType | undefined;
                readonly loading?: boolean | undefined;
                readonly loadingIcon?: import("element-plus/es/utils/index.mjs").IconPropType | undefined;
                readonly plain?: boolean | undefined;
                readonly text?: boolean | undefined;
                readonly link?: boolean | undefined;
                readonly bg?: boolean | undefined;
                readonly autofocus?: boolean | undefined;
                readonly round?: boolean | undefined;
                readonly circle?: boolean | undefined;
                readonly dashed?: boolean | undefined;
                readonly color?: string | undefined;
                readonly dark?: boolean | undefined;
                readonly autoInsertSpace?: boolean | undefined;
                readonly tag?: (string | import("vue").Component) | undefined;
                readonly onClick?: ((evt: MouseEvent) => any) | undefined | undefined;
            } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, keyof import("vue").VNodeProps | keyof import("vue").AllowedComponentProps | "onClick">>) => void;
        } & {
            ButtonGroup: {
                new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("element-plus/es/components/button/src/button-group.mjs").ButtonGroupProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
                    type: "" | "default" | "info" | "primary" | "success" | "warning" | "text" | "danger";
                    direction: "horizontal" | "vertical";
                }, false, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
                    P: {};
                    B: {};
                    D: {};
                    C: {};
                    M: {};
                    Defaults: {};
                }, Readonly<import("element-plus/es/components/button/src/button-group.mjs").ButtonGroupProps> & Readonly<{}>, {}, {}, {}, {}, {
                    type: "" | "default" | "info" | "primary" | "success" | "warning" | "text" | "danger";
                    direction: "horizontal" | "vertical";
                }>;
                __isFragment?: never;
                __isTeleport?: never;
                __isSuspense?: never;
            } & import("vue").ComponentOptionsBase<Readonly<import("element-plus/es/components/button/src/button-group.mjs").ButtonGroupProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
                type: "" | "default" | "info" | "primary" | "success" | "warning" | "text" | "danger";
                direction: "horizontal" | "vertical";
            }, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
                $slots: {
                    default?: (props: {}) => any;
                };
            });
        };
    };
    setup(): {
        handleSet: () => void;
        handleGet: () => void;
        handleRemove: () => void;
        handleJSONSet: () => void;
        handleJSONGet: () => void;
        handleJSONRemove: () => void;
        ckValue: import("vue").Ref<string, string>;
        jnValue: import("vue").Ref<any, any>;
    };
    template: string;
};
export declare const Color: () => {
    components: {
        ElButton: {
            new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("element-plus").ButtonProps> & Readonly<{
                onClick?: ((evt: MouseEvent) => any) | undefined;
            }>, {
                ref: import("vue").Ref<HTMLButtonElement | undefined, HTMLButtonElement | undefined>;
                size: import("vue").ComputedRef<"" | "default" | "small" | "large">;
                type: import("vue").ComputedRef<"default" | "" | "info" | "primary" | "success" | "warning" | "text" | "danger">;
                disabled: import("vue").ComputedRef<boolean>;
                shouldAddSpace: import("vue").ComputedRef<boolean>;
            }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
                click: (evt: MouseEvent) => void;
            }, import("vue").PublicProps, {
                type: import("element-plus").ButtonType;
                text: boolean;
                disabled: boolean;
                round: boolean;
                dashed: boolean;
                nativeType: import("element-plus").ButtonNativeType;
                loadingIcon: import("element-plus/es/utils/index.mjs").IconPropType;
                plain: boolean;
                autoInsertSpace: boolean;
                tag: string | import("vue").Component;
            }, false, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
                P: {};
                B: {};
                D: {};
                C: {};
                M: {};
                Defaults: {};
            }, Readonly<import("element-plus").ButtonProps> & Readonly<{
                onClick?: ((evt: MouseEvent) => any) | undefined;
            }>, {
                ref: import("vue").Ref<HTMLButtonElement | undefined, HTMLButtonElement | undefined>;
                size: import("vue").ComputedRef<"" | "default" | "small" | "large">;
                type: import("vue").ComputedRef<"default" | "" | "info" | "primary" | "success" | "warning" | "text" | "danger">;
                disabled: import("vue").ComputedRef<boolean>;
                shouldAddSpace: import("vue").ComputedRef<boolean>;
            }, {}, {}, {}, {
                type: import("element-plus").ButtonType;
                text: boolean;
                disabled: boolean;
                round: boolean;
                dashed: boolean;
                nativeType: import("element-plus").ButtonNativeType;
                loadingIcon: import("element-plus/es/utils/index.mjs").IconPropType;
                plain: boolean;
                autoInsertSpace: boolean;
                tag: string | import("vue").Component;
            }>;
            __isFragment?: never;
            __isTeleport?: never;
            __isSuspense?: never;
        } & import("vue").ComponentOptionsBase<Readonly<import("element-plus").ButtonProps> & Readonly<{
            onClick?: ((evt: MouseEvent) => any) | undefined;
        }>, {
            ref: import("vue").Ref<HTMLButtonElement | undefined, HTMLButtonElement | undefined>;
            size: import("vue").ComputedRef<"" | "default" | "small" | "large">;
            type: import("vue").ComputedRef<"default" | "" | "info" | "primary" | "success" | "warning" | "text" | "danger">;
            disabled: import("vue").ComputedRef<boolean>;
            shouldAddSpace: import("vue").ComputedRef<boolean>;
        }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
            click: (evt: MouseEvent) => void;
        }, string, {
            type: import("element-plus").ButtonType;
            text: boolean;
            disabled: boolean;
            round: boolean;
            dashed: boolean;
            nativeType: import("element-plus").ButtonNativeType;
            loadingIcon: import("element-plus/es/utils/index.mjs").IconPropType;
            plain: boolean;
            autoInsertSpace: boolean;
            tag: string | import("vue").Component;
        }, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
            $slots: {
                loading?: (props: {}) => any;
            } & {
                icon?: (props: {}) => any;
            } & {
                default?: (props: {}) => any;
            };
        }) & import("vue").ObjectPlugin & {
            setPropsDefaults: (defaults: Partial<Omit<{
                readonly size?: import("element-plus").ComponentSize | undefined;
                readonly disabled?: boolean | undefined;
                readonly type?: import("element-plus").ButtonType | undefined;
                readonly icon?: import("element-plus/es/utils/index.mjs").IconPropType | undefined;
                readonly nativeType?: import("element-plus").ButtonNativeType | undefined;
                readonly loading?: boolean | undefined;
                readonly loadingIcon?: import("element-plus/es/utils/index.mjs").IconPropType | undefined;
                readonly plain?: boolean | undefined;
                readonly text?: boolean | undefined;
                readonly link?: boolean | undefined;
                readonly bg?: boolean | undefined;
                readonly autofocus?: boolean | undefined;
                readonly round?: boolean | undefined;
                readonly circle?: boolean | undefined;
                readonly dashed?: boolean | undefined;
                readonly color?: string | undefined;
                readonly dark?: boolean | undefined;
                readonly autoInsertSpace?: boolean | undefined;
                readonly tag?: (string | import("vue").Component) | undefined;
                readonly onClick?: ((evt: MouseEvent) => any) | undefined | undefined;
            } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, keyof import("vue").VNodeProps | keyof import("vue").AllowedComponentProps | "onClick">>) => void;
        } & {
            ButtonGroup: {
                new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("element-plus/es/components/button/src/button-group.mjs").ButtonGroupProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
                    type: "" | "default" | "info" | "primary" | "success" | "warning" | "text" | "danger";
                    direction: "horizontal" | "vertical";
                }, false, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
                    P: {};
                    B: {};
                    D: {};
                    C: {};
                    M: {};
                    Defaults: {};
                }, Readonly<import("element-plus/es/components/button/src/button-group.mjs").ButtonGroupProps> & Readonly<{}>, {}, {}, {}, {}, {
                    type: "" | "default" | "info" | "primary" | "success" | "warning" | "text" | "danger";
                    direction: "horizontal" | "vertical";
                }>;
                __isFragment?: never;
                __isTeleport?: never;
                __isSuspense?: never;
            } & import("vue").ComponentOptionsBase<Readonly<import("element-plus/es/components/button/src/button-group.mjs").ButtonGroupProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
                type: "" | "default" | "info" | "primary" | "success" | "warning" | "text" | "danger";
                direction: "horizontal" | "vertical";
            }, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
                $slots: {
                    default?: (props: {}) => any;
                };
            });
        };
    };
    setup(): {
        handleToRgb: () => void;
        rgbValue: import("vue").Ref<string, string>;
        handleToRgba: () => void;
        rgbaValue: import("vue").Ref<string, string>;
        handleToHex: () => void;
        hexValue: import("vue").Ref<string, string>;
    };
    template: string;
};
export declare const Upload: () => {
    components: {
        ElButton: {
            new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("element-plus").ButtonProps> & Readonly<{
                onClick?: ((evt: MouseEvent) => any) | undefined;
            }>, {
                ref: import("vue").Ref<HTMLButtonElement | undefined, HTMLButtonElement | undefined>;
                size: import("vue").ComputedRef<"" | "default" | "small" | "large">;
                type: import("vue").ComputedRef<"default" | "" | "info" | "primary" | "success" | "warning" | "text" | "danger">;
                disabled: import("vue").ComputedRef<boolean>;
                shouldAddSpace: import("vue").ComputedRef<boolean>;
            }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
                click: (evt: MouseEvent) => void;
            }, import("vue").PublicProps, {
                type: import("element-plus").ButtonType;
                text: boolean;
                disabled: boolean;
                round: boolean;
                dashed: boolean;
                nativeType: import("element-plus").ButtonNativeType;
                loadingIcon: import("element-plus/es/utils/index.mjs").IconPropType;
                plain: boolean;
                autoInsertSpace: boolean;
                tag: string | import("vue").Component;
            }, false, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
                P: {};
                B: {};
                D: {};
                C: {};
                M: {};
                Defaults: {};
            }, Readonly<import("element-plus").ButtonProps> & Readonly<{
                onClick?: ((evt: MouseEvent) => any) | undefined;
            }>, {
                ref: import("vue").Ref<HTMLButtonElement | undefined, HTMLButtonElement | undefined>;
                size: import("vue").ComputedRef<"" | "default" | "small" | "large">;
                type: import("vue").ComputedRef<"default" | "" | "info" | "primary" | "success" | "warning" | "text" | "danger">;
                disabled: import("vue").ComputedRef<boolean>;
                shouldAddSpace: import("vue").ComputedRef<boolean>;
            }, {}, {}, {}, {
                type: import("element-plus").ButtonType;
                text: boolean;
                disabled: boolean;
                round: boolean;
                dashed: boolean;
                nativeType: import("element-plus").ButtonNativeType;
                loadingIcon: import("element-plus/es/utils/index.mjs").IconPropType;
                plain: boolean;
                autoInsertSpace: boolean;
                tag: string | import("vue").Component;
            }>;
            __isFragment?: never;
            __isTeleport?: never;
            __isSuspense?: never;
        } & import("vue").ComponentOptionsBase<Readonly<import("element-plus").ButtonProps> & Readonly<{
            onClick?: ((evt: MouseEvent) => any) | undefined;
        }>, {
            ref: import("vue").Ref<HTMLButtonElement | undefined, HTMLButtonElement | undefined>;
            size: import("vue").ComputedRef<"" | "default" | "small" | "large">;
            type: import("vue").ComputedRef<"default" | "" | "info" | "primary" | "success" | "warning" | "text" | "danger">;
            disabled: import("vue").ComputedRef<boolean>;
            shouldAddSpace: import("vue").ComputedRef<boolean>;
        }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
            click: (evt: MouseEvent) => void;
        }, string, {
            type: import("element-plus").ButtonType;
            text: boolean;
            disabled: boolean;
            round: boolean;
            dashed: boolean;
            nativeType: import("element-plus").ButtonNativeType;
            loadingIcon: import("element-plus/es/utils/index.mjs").IconPropType;
            plain: boolean;
            autoInsertSpace: boolean;
            tag: string | import("vue").Component;
        }, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
            $slots: {
                loading?: (props: {}) => any;
            } & {
                icon?: (props: {}) => any;
            } & {
                default?: (props: {}) => any;
            };
        }) & import("vue").ObjectPlugin & {
            setPropsDefaults: (defaults: Partial<Omit<{
                readonly size?: import("element-plus").ComponentSize | undefined;
                readonly disabled?: boolean | undefined;
                readonly type?: import("element-plus").ButtonType | undefined;
                readonly icon?: import("element-plus/es/utils/index.mjs").IconPropType | undefined;
                readonly nativeType?: import("element-plus").ButtonNativeType | undefined;
                readonly loading?: boolean | undefined;
                readonly loadingIcon?: import("element-plus/es/utils/index.mjs").IconPropType | undefined;
                readonly plain?: boolean | undefined;
                readonly text?: boolean | undefined;
                readonly link?: boolean | undefined;
                readonly bg?: boolean | undefined;
                readonly autofocus?: boolean | undefined;
                readonly round?: boolean | undefined;
                readonly circle?: boolean | undefined;
                readonly dashed?: boolean | undefined;
                readonly color?: string | undefined;
                readonly dark?: boolean | undefined;
                readonly autoInsertSpace?: boolean | undefined;
                readonly tag?: (string | import("vue").Component) | undefined;
                readonly onClick?: ((evt: MouseEvent) => any) | undefined | undefined;
            } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, keyof import("vue").VNodeProps | keyof import("vue").AllowedComponentProps | "onClick">>) => void;
        } & {
            ButtonGroup: {
                new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("element-plus/es/components/button/src/button-group.mjs").ButtonGroupProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
                    type: "" | "default" | "info" | "primary" | "success" | "warning" | "text" | "danger";
                    direction: "horizontal" | "vertical";
                }, false, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
                    P: {};
                    B: {};
                    D: {};
                    C: {};
                    M: {};
                    Defaults: {};
                }, Readonly<import("element-plus/es/components/button/src/button-group.mjs").ButtonGroupProps> & Readonly<{}>, {}, {}, {}, {}, {
                    type: "" | "default" | "info" | "primary" | "success" | "warning" | "text" | "danger";
                    direction: "horizontal" | "vertical";
                }>;
                __isFragment?: never;
                __isTeleport?: never;
                __isSuspense?: never;
            } & import("vue").ComponentOptionsBase<Readonly<import("element-plus/es/components/button/src/button-group.mjs").ButtonGroupProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
                type: "" | "default" | "info" | "primary" | "success" | "warning" | "text" | "danger";
                direction: "horizontal" | "vertical";
            }, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
                $slots: {
                    default?: (props: {}) => any;
                };
            });
        };
    };
    setup(): {
        handleToRgb: () => void;
        handleToRgba: () => void;
    };
    template: string;
};
