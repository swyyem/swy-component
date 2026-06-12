/**
 * @description hex颜色转rgb颜色
 * @param {String} str 颜色值字符串
 * @returns {String} 返回处理后的颜色值
 */
export declare function hexToRgb(str: string): number[];
export declare function hexToRgba(str: string, opacity: number): string;
export declare function rgbToHex(r: number, g: number, b: number): string;
/**
 * @description 加深颜色值
 * @param {String} color 颜色值字符串
 * @param {Number} level 加深的程度，限0-1之间
 * @returns {String} 返回处理后的颜色值
 */
export declare function getDarkColor(color: string, level: number): string;
/**
 * @description 变浅颜色值
 * @param {String} color 颜色值字符串
 * @param {Number} level 加深的程度，限0-1之间
 * @returns {String} 返回处理后的颜色值
 */
export declare function getLightColor(color: string, level: number): string;
declare const color: {
    hexToRgb: typeof hexToRgb;
    hexToRgba: typeof hexToRgba;
    rgbToHex: typeof rgbToHex;
    getDarkColor: typeof getDarkColor;
    getLightColor: typeof getLightColor;
};
export default color;
