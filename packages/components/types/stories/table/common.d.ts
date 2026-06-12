export declare const columns: ({
    label: string;
    type: string;
    width: string;
    prop?: undefined;
    valueType?: undefined;
    proFieldProps?: undefined;
} | {
    prop: string;
    label: string;
    type?: undefined;
    width?: undefined;
    valueType?: undefined;
    proFieldProps?: undefined;
} | {
    prop: string;
    label: string;
    width: number;
    type?: undefined;
    valueType?: undefined;
    proFieldProps?: undefined;
} | {
    prop: string;
    label: string;
    valueType: string;
    width: number;
    proFieldProps: {
        fieldProps: {
            multiple: boolean;
        };
    };
    type?: undefined;
} | {
    prop: string;
    label: string;
    width: number;
    valueType: string;
    proFieldProps: {
        fieldProps: {
            valueEnum: {
                label: string;
                value: string;
            }[];
        };
    };
    type?: undefined;
})[];
export declare const childColumns: ({
    label: string;
    type: string;
    width: string;
    prop?: undefined;
    valueType?: undefined;
    proFieldProps?: undefined;
} | {
    prop: string;
    label: string;
    type?: undefined;
    width?: undefined;
    valueType?: undefined;
    proFieldProps?: undefined;
} | {
    prop: string;
    label: string;
    width: number;
    type?: undefined;
    valueType?: undefined;
    proFieldProps?: undefined;
} | {
    prop: string;
    label: string;
    valueType: string;
    width: number;
    proFieldProps: {
        fieldProps: {
            multiple: boolean;
        };
    };
    type?: undefined;
} | {
    prop: string;
    label: string;
    width: number;
    valueType: string;
    proFieldProps: {
        fieldProps: {
            valueEnum: {
                label: string;
                value: string;
            }[];
        };
    };
    type?: undefined;
})[];
export declare const multipleColumns: ({
    label: string;
    type: string;
    width: string;
    align?: undefined;
    children?: undefined;
} | {
    label: string;
    align: "center";
    children: {
        label: string;
        align: "center";
        children: ({
            label: string;
            type: string;
            width: string;
            prop?: undefined;
            valueType?: undefined;
            proFieldProps?: undefined;
        } | {
            prop: string;
            label: string;
            type?: undefined;
            width?: undefined;
            valueType?: undefined;
            proFieldProps?: undefined;
        } | {
            prop: string;
            label: string;
            width: number;
            type?: undefined;
            valueType?: undefined;
            proFieldProps?: undefined;
        } | {
            prop: string;
            label: string;
            valueType: string;
            width: number;
            proFieldProps: {
                fieldProps: {
                    multiple: boolean;
                };
            };
            type?: undefined;
        } | {
            prop: string;
            label: string;
            width: number;
            valueType: string;
            proFieldProps: {
                fieldProps: {
                    valueEnum: {
                        label: string;
                        value: string;
                    }[];
                };
            };
            type?: undefined;
        })[];
    }[];
    type?: undefined;
    width?: undefined;
})[];
export declare const expandColumns: ({
    label: string;
    type: string;
    width: string;
    prop?: undefined;
    valueType?: undefined;
    proFieldProps?: undefined;
} | {
    prop: string;
    label: string;
    type?: undefined;
    width?: undefined;
    valueType?: undefined;
    proFieldProps?: undefined;
} | {
    prop: string;
    label: string;
    width: number;
    type?: undefined;
    valueType?: undefined;
    proFieldProps?: undefined;
} | {
    prop: string;
    label: string;
    valueType: string;
    width: number;
    proFieldProps: {
        fieldProps: {
            multiple: boolean;
        };
    };
    type?: undefined;
} | {
    prop: string;
    label: string;
    width: number;
    valueType: string;
    proFieldProps: {
        fieldProps: {
            valueEnum: {
                label: string;
                value: string;
            }[];
        };
    };
    type?: undefined;
})[];
export type RowVO = {
    id: number;
    name: string;
    age: number;
    birth: string;
    selected: boolean;
    region: string;
    enableFlag: boolean;
    children?: RowVO[];
    hasChildren?: boolean;
    price?: number;
};
export declare const generateData: (n?: number, start?: number, from?: number) => RowVO[];
export declare const getTableData: (params: any, data?: RowVO[]) => Promise<unknown>;
