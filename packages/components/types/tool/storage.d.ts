export declare const localStorage: {
    /**
     * 设置
     * @param key 键名
     * @param value 值
     * @param merge 是否合并已有对象 (默认为 false)
     */
    set(key: string, value: any, merge?: boolean): void;
    /**
     * 获取
     * @param key 键名
     * @param defaultValue 默认值
     * @returns 解析后的值或默认值
     */
    get<T = string>(key: string, defaultValue?: T): T;
    /**
     * 移除
     * @param key 键名
     */
    remove(key: string): void;
    /**
     * 清空所有
     */
    clear(): void;
};
export declare const sessionStorage: {
    /**
     * 设置
     * @param key 键名
     * @param value 值
     * @param merge 是否合并已有对象 (默认为 false)
     */
    set(key: string, value: any, merge?: boolean): void;
    /**
     * 获取
     * @param key 键名
     * @param defaultValue 默认值
     * @returns 解析后的值或默认值
     */
    get<T = string>(key: string, defaultValue?: T): T;
    /**
     * 移除
     * @param key 键名
     */
    remove(key: string): void;
    /**
     * 清空所有
     */
    clear(): void;
};
