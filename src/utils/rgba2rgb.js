
/**
 * converts an aRGB string, rgba(30,30,30,0.5) into RGB, #303030.
 * @param {string} rgbaVal 
 * @returns 
 */
export default function rgba2rgb(rgbaVal) {
    // rgba(30,30,30,0.5) -> #303030
    const extracted = /rgba\((\d+)\,(\d+)\,(\d+)\,.+\)/.exec(rgbaVal);
    const toHex = (val) => parseInt(val).toString(16);
    try {
        return `#${toHex(extracted[1]).padStart(2, '0')}${toHex(extracted[2]).padStart(2, '0')}${toHex(extracted[3]).padStart(2, '0')}`;
    } catch {
        return rgbaVal;
    }
}