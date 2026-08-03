/**
 * @class
 */
export default class Util{
    /**
     * @static @async @method
     * @param {number} ms
     * @returns {Promise<void>} A promise that resolves after the specified time.
     */
    static async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}