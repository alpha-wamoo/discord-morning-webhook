export default class Logger{
    /**@private @static @type{number} */
    static depth = 0;
    /**@private @static @type{string} */
    static depthMergin = "";

    /**
     * @param {string} fName
     * @returns {void}
     */
    static fcall(fName){
        console.log(`${this.depthMergin}>> ${fName}`);
        this.depth++;
        this.depthMergin += "\t";
    }

    /**
     * @static @method
     * @param {string} fName
     * @returns {void}
     */
    static fexit(fName){
        this.depth--;
        this.depthMergin = this.depthMergin.slice(0, -1);
        console.log(`${this.depthMergin}<< ${fName}`);
    }

    /**
     * @static @method
     * @param {string} msg
     * @returns {void}
     */
    static info(msg){
        console.log(`${this.depthMergin}[INFO] ${msg}`);
    }

    /**
     * @static @method
     * @param {string} msg
     * @returns {void}
     */
    static warn(msg){
        console.warn(`${this.depthMergin}[WARN] ${msg}`);
    }

    /**
     * @static @method
     * @param {string} msg
     * @returns {void}
     */
    static error(msg){
        console.error(`${this.depthMergin}[ERROR] ${msg}`);
    }
}