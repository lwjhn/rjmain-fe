const class2type = {},
    toString = class2type.toString,
    hasOwn = class2type.hasOwnProperty,
    fnToString = hasOwn.toString,
    ObjectFunctionString = fnToString.call(Object);

export default {
    joinArray(elements, delimiter, prefix, suffix) {
        if (!elements) return ''
        return `${prefix ? (elements.length > 1 ? prefix : '') : ''}${elements.join(delimiter ? delimiter : '')}${suffix ? (elements.length > 1 ? suffix : '') : ''}`
    },
    formatDate(date, format) {
        let o = {
            "M+": date.getMonth() + 1, //month
            "d+": date.getDate(),    //day

            "h+": date.getHours(),   //hour
            "m+": date.getMinutes(), //minute
            "s+": date.getSeconds(), //second
            "q+": Math.floor((date.getMonth() + 3) / 3),  //quarter
            "S": date.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    },
    formatStringDate(dateTime, format){
        return dateTime ? this.formatDate(
            new Date(dateTime.replace(/[-T]|(\..*\+)/gi, c => c === '-' ? '/' : (/T/i.test(c) ? ' ' : ' GMT+'))),
            format) : ''
    },
    isFunction(obj) {
        return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function"
    },
    isPlainObject(obj) {
        let proto, Ctor;
        if (!obj || toString.call(obj) !== "[object Object]")
            return false;
        if (!(proto = Object.getPrototypeOf(obj)))
            return true;
        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    },
    extend() {
        let options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        if (typeof target !== "object" && !this.isFunction(target))
            target = {};
        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    copy = options[name];
                    if (name === "__proto__" || target === copy)
                        continue;
                    if (deep && copy && (this.isPlainObject(copy) ||
                        (copyIsArray = Array.isArray(copy)))) {
                        src = target[name];

                        if (copyIsArray && !Array.isArray(src)) {
                            clone = [];
                        } else if (!copyIsArray && !this.isPlainObject(src)) {
                            clone = {};
                        } else {
                            clone = src;
                        }
                        copyIsArray = false;
                        target[name] = this.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    },
    camelToUpperUnderscore(param) {
        return param ? param.replace(/([A-Z])/g,'_$1').toLowerCase().replace(/^_+/,'') : param
    },
    underscoreToLowerCamel(param) {
        return param ? param.toLowerCase().replace(/\_+(\w)/g, function(all, letter){
            return letter.toUpperCase();
        }) : param
    }
}
