import type { ProSystemInfoType, ProEnvType, ProPrintCb } from './index.types';
export interface ProToolType {
    isElectron: boolean;
    systemInfoAsync: () => Promise<ProSystemInfoType>;
    envAsync: () => Promise<ProEnvType>;
    print: ProPrintCb;
}
declare abstract class BaseEnv {
    abstract isElectron: boolean;
    abstract systemInfoAsync: ProToolType['systemInfoAsync'];
    abstract envAsync: ProToolType['envAsync'];
    abstract print: ProToolType['print'];
    cookieUtil: import("./cookie").CookieClass;
    localStorage: {
        set(key: string, value: any, merge?: boolean): void;
        get<T = string>(key: string, defaultValue?: T): T;
        remove(key: string): void;
        clear(): void;
    };
    sessionStorage: {
        set(key: string, value: any, merge?: boolean): void;
        get<T = string>(key: string, defaultValue?: T): T;
        remove(key: string): void;
        clear(): void;
    };
    color: {
        hexToRgb: typeof import("./color").hexToRgb;
        hexToRgba: typeof import("./color").hexToRgba;
        rgbToHex: typeof import("./color").rgbToHex;
        getDarkColor: typeof import("./color").getDarkColor;
        getLightColor: typeof import("./color").getLightColor;
    };
    upload: {
        handlePreview: (fileBusinessList: import("./upload").BusinessType[]) => Promise<{
            createFileMetadataList: {
                [key: string]: unknown;
                id?: string | null;
                businessId: string;
                businessType: string;
                createdAt?: string | number | Date | null;
                encrypted?: boolean | null;
                fileSize: number;
                fileType: string;
                name: string;
                path: string;
                storageType: "MINIO" | "LOCAL" | "ALIYUN_OSS" | "AWS_S3";
                updatedAt?: string | number | Date | null;
                uploadBy?: string | null;
            }[];
        } | undefined>;
        relatedBusiness: (uploadObject: import("./upload").ModelProps) => Promise<import("element-plus").MessageHandler | {
            uploadObject: import("./upload").ModelProps;
            result: {
                code: number;
                message?: string;
                data?: unknown;
            };
            error?: undefined;
        } | {
            uploadObject: import("./upload").ModelProps;
            error: unknown;
            result?: undefined;
        }>;
    };
}
declare class ElectronEnv extends BaseEnv {
    isElectron: boolean;
    cookieUtil: import("./cookie").CookieClass;
    systemInfoAsync: () => Promise<ProSystemInfoType>;
    envAsync: () => Promise<ProEnvType>;
    print: ProPrintCb;
}
declare class BrowserEnv extends BaseEnv {
    isElectron: boolean;
    cookieUtil: import("./cookie").CookieClass;
    systemInfoAsync: () => Promise<ProSystemInfoType>;
    envAsync: () => Promise<{
        electron: {
            dev: boolean;
            prod: boolean;
            test: boolean;
            stage: boolean;
            online: boolean;
        };
    }>;
    print: () => import("element-plus").MessageHandler;
}
declare const ProTool: ElectronEnv | BrowserEnv;
export default ProTool;
