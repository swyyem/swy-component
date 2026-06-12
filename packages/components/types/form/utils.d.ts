import type { ProFormValueType, PropFormFieldProps, FiledForm } from './form.types';
type AnyObject = Record<PropertyKey, any>;
export declare const structuredClone: (obj: any, map?: WeakMap<WeakKey, any>) => any;
export declare const disposeDataByEmpty: (data: AnyObject) => AnyObject;
export declare const omitProps: <T extends Record<string, any>>(props: T, omitKeys: Array<keyof T>) => {
    [k: string]: any;
};
export declare const transferParams: (params: PropFormFieldProps["params"], values: ProFormValueType) => ProFormValueType;
export declare const getPureData: (initialValues: ProFormValueType, omitNil?: boolean) => any;
export declare const getRealColumnKeys: (columns: FiledForm[]) => string[];
export {};
