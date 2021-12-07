import path from "path"

export function ajax(option) {
    let {url, method, data, dataType, header, progress, httpRequest} = Object.assign({
        method: 'get', dataType: 'json', header: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }, option)
    return new Promise((resolve, reject) => {
        if (!httpRequest) {
            httpRequest = new XMLHttpRequest()
        } else {
            httpRequest.abort()
        }
        if (typeof progress === 'function') {
            httpRequest.addEventListener('progress', progress)    //  evt.lengthComputable evt.loaded / evt.total
        }
        httpRequest.addEventListener("load", () => {
            if (httpRequest.status !== 200) {
                reject(new Error(httpRequest.response ? (httpRequest.response.message ? httpRequest.response.message : httpRequest.response) : httpRequest.statusText), httpRequest.response)
            } else {
                try {
                    resolve(/json/i.test(dataType) && typeof httpRequest.response === 'string' ? JSON.parse(httpRequest.response) : httpRequest.response)
                } catch (e) {
                    reject(e, httpRequest.response)
                }
            }
        })

        httpRequest.addEventListener("error", e => reject(e))
        httpRequest.open(method, !/^(http:|https:|:)?\/\/([^\/\\?&#=]*)/i.test(url) && window.config && window.config.host ? path.join(window.config.host, url) : url, true)
        httpRequest.responseType = dataType
        for (let key in header) {
            if (header.hasOwnProperty(key)) {
                httpRequest.setRequestHeader(key, header[key])
            }
        }
        httpRequest.send(typeof data === 'string' ? data : JSON.stringify(data))
    })
}

ajax.post = function (url, data, option) {
    return ajax(Object.assign({
        url, method: 'post', data
    }, option))
}

ajax.get = function (url, option) {
    return ajax(Object.assign({
        url, method: 'get'
    }, option))
}

export default ajax
