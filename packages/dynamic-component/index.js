import DynamicComponent from './dynamic-component'

DynamicComponent.install = function (Vue) {
    Vue.component(DynamicComponent.name, DynamicComponent)
}

export default DynamicComponent
