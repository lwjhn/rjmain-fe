class Download {
    constructor(contentType) {
        this.aTag = document.createElement('a')
        this.contentType = contentType ? contentType : 'application/json;charset=UTF-8' //text/plain;charset=UTF-8
    }

    formatSize(size, pointLength, units) {
        let unit;
        units = units || ['B', 'K', 'M', 'G', 'TB'];
        while ((unit = units.shift()) && size > 1024) {
            size = size / 1024;
        }
        return (unit === 'B' ? size : size.toFixed(pointLength || 2)) +
            unit;
    }

    get(url, filename, progress) {
        return this.ajax(url, 'get', null, filename, progress)
    }

    post(url, data, filename, progress) {
        return this.ajax(url, 'post', data, filename, progress)
    }

    ajax(url, method, data, filename, progress) {
        return new Promise((resolve, reject) => {
            if (!(url && filename))
                return reject(new Error('参数错误！'))

            const x = new XMLHttpRequest()
            if (typeof progress === 'function')
                x.addEventListener('progress', progress)    //  evt.lengthComputable evt.loaded / evt.total

            x.addEventListener("load", () => {
                try {
                    if (x.status !== 200) {
                        let reader = new FileReader()
                        reader.readAsText(x.response, 'utf-8')
                        return reader.onload = () =>
                            reject(new Error(reader.result.toString()))
                    }

                    this.saveBlob(x.response, filename)
                } catch (e) {
                    reject(e)
                }
                resolve()
            })

            x.addEventListener("error", e => reject(e))
            x.open(method, url, true)
            x.responseType = 'blob'
            x.setRequestHeader('content-type', this.contentType)
            x.send(data)
        })
    }

    saveAs(obj, filename) {
        if (!obj) obj = ""
        let blob = new Blob([obj], {type: 'application/octet-stream'})
        this.saveBlob(blob, filename)
        blob = null
    }

    saveBlob(blob, filename) {
        if (!blob || blob.toString() !== "[object Blob]")
            return this.saveAs(blob, filename)

        if (window.navigator && 'msSaveOrOpenBlob' in window.navigator) {
            if (!window.navigator.msSaveOrOpenBlob(blob, filename))
                throw new Error("下载文件失败！")
        } else
            this.callTagA(window.URL.createObjectURL(blob), filename)
    }

    img2base64(img, width, height) {
        let canvas = document.createElement("canvas")
        canvas.width = width ? width : img.width
        canvas.height = height ? height : img.height
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height)
        return canvas.toDataURL()
    }

    imgURL2base64(url, width, height) {
        return new Promise((resolve, reject)=>{
            let img = new Image()
            img.onload = ()=>{
                resolve(this.img2base64(img, width, height))
            }
            img.src = url
        })
    }

    getWaterMask(text, width, height, font, globalAlpha, rotate, strokeText) {
        let canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d')
        canvas.width = width ? width : 100
        canvas.height = height ? height : 100
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.globalAlpha = isNaN(globalAlpha = parseFloat(globalAlpha)) ? 0.1 : globalAlpha
        ctx.font = font ? font : '20px Microsoft Yahei'
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(-Math.PI * (isNaN(rotate = parseFloat(rotate)) ? 0.25 : rotate))
        strokeText ? ctx.strokeText(text ? text : '水印', 0, 0) : ctx.fillText(text ? text : '水印', 0, 0)
        return canvas
    }

    getWaterMaskURL() {
        return this.getWaterMask.apply(this, arguments).toDataURL()
    }

    callTagA(href, filename) {
        try {
            document.body.appendChild(this.aTag)
            this.aTag.href = href
            this.aTag.download = filename
            this.aTag.click()
        } finally {
            this.aTag.href = '#'
            window.URL.revokeObjectURL(this.aTag.href)
            this.aTag.remove()
        }
    }
}

export default Download
