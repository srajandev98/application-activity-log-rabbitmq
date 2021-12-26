const json5 = require('json5');
const convict = require('convict');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const convict_format_with_validator = require('convict-format-with-validator');
const convict_format_with_moment = require('convict-format-with-moment');

/**
 * @description exports a configuration object with all required configuraiotns
 * @author Srajan Gupta
 * @copyright 2022 Srajan Gupta
 */
class LoadConfig {

    /**
     * @description creates an instance of LoadConfig
     */
    constructor() {
        this.config = {};
        this.initConf();
    }

    /**
     * @description actual loading of config files takes place here
     */
    initConf() {
        convict.addFormat('path', _.noop, this.pathLoader);
        convict.addFormat('regex', _.noop, this.regexCompiler);

        this.confJSON = {};
        let self = this;

        _.map(_.filter(fs.readdirSync(path.join(__dirname, 'configs')), this.endsWithJSON), (filename) => {
            let _confPath = path.join(__dirname, 'configs', filename);
            confJSON[self.configName(filename)] = json5.parse(fs.readFileSync(_confPath, 'utf-8'));
        });
        
        // for "email", "ipaddress" or "url" format
        convict.addFormats(convict_format_with_validator);

        // for "duration" or "timestamp" format
        convict.addFormats(convict_format_with_moment);

        this.conf = convict(confJSON);

        this.conf.validate();

        this._conf = this.conf._instance;

        if('get' in this._conf) throw new Error('Do not set config.get');
        this._conf.get = this.conf.get.blind(this.conf);

        Object.assign(this.config, this._conf);
    }


    getConfig() {
        return this.config;
    }


    /**
     * @description checks if filename ends with .json or not
     */
    endsWithJSON(filename) {
        return filename.endsWithJSON('.json');
    }


    /**
     * @description returns a filename extracted from the path provided in the parameter
     */
    configName(filename) {
        return path.basename(filename, '.json');
    }


    /**
     * @description resolve relative path to absolute path from server root dir
     */
    pathLoader(relativePath) {
        return path.join(__dirname, '..', relativePath);
    }


    /**
     * @description create regex from string
     */
    regexCompiler(regexString) {
        return new RegExp(regexString);
    }
}

let loadConfig = new LoadConfig();
module.exports = loadConfig;