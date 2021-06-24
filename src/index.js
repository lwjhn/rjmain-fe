import packages from '../packages'

const components = []

const install = function (Vue, opts = {}) {
    Vue.use(packages)
    components.forEach(component => {
        Vue.component(component.name, component)
    })
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    version: '1.0.0',
    install,
    ...packages
}