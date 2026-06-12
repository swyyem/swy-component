import type { ProCookieAttributes } from './index.types';
declare class CookieClass {
    private defaultAttributes;
    constructor(defaultAttributes?: ProCookieAttributes);
    set(name: string, value: any, options?: ProCookieAttributes): void;
    get<T = string>(name: string): T | undefined;
    remove(name: string, options?: ProCookieAttributes): void;
    withAttributes(defaults: ProCookieAttributes): CookieClass;
}
export { CookieClass };
declare const cookieUtil: CookieClass;
export default cookieUtil;
