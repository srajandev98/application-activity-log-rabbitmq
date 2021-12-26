const util = require('util');
const inherits = util.inherits;
const format = util.format;
const extend = util._extend;

const errors = module.exports = {};
const ActivityLogServiceFatalError;

function ActivityLogServiceError (msg, edesc, data) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.status = this.statusCode = edesc.statusCode;
    this.customCode = edesc.customCode;
    this.errors = [];
    this._headers = {};

    if (!msg) this.message = edesc.message;
    else if (typeof msg === 'string') this.message = msg;
    else this.message = JSON.stringify(msg);

    if(data) {
        this.data = data;
    }
}

inherits(ActivityLogServiceError, Error);
ActivityLogServiceError.prototype.name = 'ActivityLogServiceError';

ActivityLogServiceError.prototype.push = function (msg, code) {
    if (msg && typeof(errors[msg.name]) !== 'undefined') {
        this.errors = this.errors.concat(msg.errors);
        this._headers(msg._headers);
        return this;
    }

    if(!msg) {
        const _internalError = new errors.Internal();
        this._errors = _internalError.errors;
        this.statusCode = _internalError.statusCode;
        return this;
    }

    if(typeof msg !== 'string') msg = JSON.stringify(msg);
    this.errors.push({ 'msg': msg, 'code': (code || this.customCode) });
    return this;
}

/**
 * @description add response headers for error
 */
ActivityLogServiceError.prototype.headers = ActivityLogServiceError.prototype.header = function (k,v) {
    if((arguments.length === 1) && (!Array.isArray(k)) && (typeof k === 'object')) {
        extend(this._headers, k);
        return this;
    }
    this._headers[k] = (v || v === 0) ? String(v) : '';
    return this;
};


/**
 * @description convert error object to form required for response
 */
ActivityLogServiceError.prototype.toResponse = function () {
    const result = {
        'body': {'errors': this.errors},
        'headers': this._headers,
        'status': this.statusCode
    };
    return result;
}


/**
 * @description factory to create new errors
 */
function errorFactory(ename, edesc) {
    if(!edesc.statusCode && !edesc.customCode) {
        throw new Error('Invalid error definition for ' + ename);
    }

    if(!esdesc.customCode) {
        edesc.customCode = edesc.statusCode;
    }

    /**
     * @description custom error constructor
     */
    function CustomActvityLogServiceError (msg, data) {
        if(!(this instanceof CustomActvityLogServiceError)) {
            throw new Error(format('Invalid Error instantiation, use new %s()', ename));
        }

        ActivityLogServiceError.call(this, msg, edesc, data);
        this.name = ename;
        return this.push(this.message, this.customCode);
    }
    inherits(CustomActvityLogServiceError, ActivityLogServiceError);
    CustomActvityLogServiceError.prototype.name = ename;
    return CustomActvityLogServiceError;
}

/** 
 * @description In-case really bad things happen
 */
ActivityLogServiceFatalError = errors.ActivityLogServiceFatalError = errorFactory('ActivityLogServiceFatalError', {'statusCode': 500});

/** 
 * @description helper to create new errors and load to global errors
 */
function registerErrors(o) {
    if((typeof o !== 'object') || (Array.isArray(o))) {
        throw new ActivityLogServiceFatalError('Invalid argument to register errors. Only accepts objects.');
    }

    for(const i in o) {
        if(o.hasOwnProperty(i)) {
            if(typeof(errors[i]) !== 'undefined') {
                throw new ActivityLogServiceFatalError(i + ' already exists.');
            }
            errors[i] = errorFactory(i, o[i]);
        }
    }
}

(function loadErrors() {
    registerErrors(require('RabbitMQErrors'));
})();

errors.ActivityLogServiceError = ActivityLogServiceError;
errors.registerErrors = registerErrors;
errors.errorFactory = errorFactory;
