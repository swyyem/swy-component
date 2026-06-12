type AnyObject = Record<PropertyKey, any>;
export declare const getValue: (data: AnyObject, key: PropertyKey) => any;
export declare const setValue: (data: AnyObject, key: PropertyKey, value: any) => void;
export declare const getDefaultValueByMultiple: <T>(value: T, multiple?: boolean) => T | T[];
export {};
