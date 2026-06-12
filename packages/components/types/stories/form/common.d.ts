export declare const columns: ({
    label: string;
    name: string;
    required: boolean;
    valueType?: undefined;
    fieldProps?: undefined;
    valueEnum?: undefined;
    colProps?: undefined;
} | {
    label: string;
    valueType: string;
    name: string;
    required: boolean;
    fieldProps: {
        placeholder: string;
        multiple?: undefined;
        clearable?: undefined;
        startPlaceholder?: undefined;
        endPlaceholder?: undefined;
        onChange?: undefined;
        onFocus?: undefined;
        onBlur?: undefined;
        onVisibleChange?: undefined;
    };
    valueEnum?: undefined;
    colProps?: undefined;
} | {
    label: string;
    valueType: string;
    name: string;
    required: boolean;
    valueEnum: {
        key: string;
        value: string;
        label: string;
    }[];
    fieldProps?: undefined;
    colProps?: undefined;
} | {
    label: string;
    required: boolean;
    valueType: string;
    name: string;
    fieldProps?: undefined;
    valueEnum?: undefined;
    colProps?: undefined;
} | {
    label: string;
    valueType: string;
    name: string;
    required: boolean;
    fieldProps: {
        multiple: boolean;
        placeholder?: undefined;
        clearable?: undefined;
        startPlaceholder?: undefined;
        endPlaceholder?: undefined;
        onChange?: undefined;
        onFocus?: undefined;
        onBlur?: undefined;
        onVisibleChange?: undefined;
    };
    valueEnum?: undefined;
    colProps?: undefined;
} | {
    label: string;
    valueType: string;
    name: string;
    required: boolean;
    valueEnum: {
        key: string;
        value: string;
        label: string;
    }[];
    colProps: {
        colStyle: {
            width: string;
        };
    };
    fieldProps?: undefined;
} | {
    label: string;
    valueType: string;
    name: string;
    required: boolean;
    fieldProps: {
        clearable: boolean;
        placeholder: string;
        startPlaceholder: string;
        endPlaceholder: string;
        onChange: (val: string[]) => void;
        onFocus: (e: Event) => void;
        onBlur: (e: Event) => void;
        onVisibleChange: () => void;
        multiple?: undefined;
    };
    colProps: {
        colStyle: {
            width: string;
        };
    };
    valueEnum?: undefined;
})[];
