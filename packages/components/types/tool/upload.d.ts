export declare const addressPrefix = "/api";
export declare const apiMap: {
    uploadFileWithBusiness: string;
    uploadFileWithoutBusiness: string;
    listFileUrlByBusiness: string;
    downloadFile: string;
    deleteFile: string;
    createFileMetadata: string;
    batchDeleteFile: string;
    batchCreateFileMetadata: string;
    batchSaveFileMetadata: string;
};
export type BusinessType = {
    businessId: string;
    businessType: 'STAFF_AVATAR' | 'STAFF_SIGNATURE';
    fileId?: string;
};
type StorageType = 'MINIO' | 'LOCAL' | 'ALIYUN_OSS' | 'AWS_S3';
type FileType = {
    id?: string | null;
    businessId: string;
    businessType: string;
    createdAt?: string | number | Date | null;
    encrypted?: boolean | null;
    fileSize: number;
    fileType: string;
    name: string;
    path: string;
    storageType: StorageType;
    updatedAt?: string | number | Date | null;
    uploadBy?: string | null;
    [key: string]: unknown;
};
export type ModelProps = {
    createFileMetadataList: FileType[];
    deleteFileMetadataList?: {
        id: string;
    }[];
};
type ApiResponse<T = unknown> = {
    code: number;
    message?: string;
    data?: T;
};
type BeforeUploadProps = {
    fieldProps?: {
        limitSize?: number;
    };
};
export declare const handlePreview: (fileBusinessList: BusinessType[]) => Promise<{
    createFileMetadataList: FileType[];
} | undefined>;
export declare const relatedBusiness: (uploadObject: ModelProps) => Promise<import("element-plus").MessageHandler | {
    uploadObject: ModelProps;
    result: ApiResponse<unknown>;
    error?: undefined;
} | {
    uploadObject: ModelProps;
    error: unknown;
    result?: undefined;
}>;
export declare const allowedExtensions: string[];
export declare const handleBeforeUpload: (file: File, props: BeforeUploadProps) => boolean;
declare const upload: {
    handlePreview: (fileBusinessList: BusinessType[]) => Promise<{
        createFileMetadataList: FileType[];
    } | undefined>;
    relatedBusiness: (uploadObject: ModelProps) => Promise<import("element-plus").MessageHandler | {
        uploadObject: ModelProps;
        result: ApiResponse<unknown>;
        error?: undefined;
    } | {
        uploadObject: ModelProps;
        error: unknown;
        result?: undefined;
    }>;
};
export default upload;
