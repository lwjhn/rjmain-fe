import RenderComponent from "../dynamic-component/dynamic-component";

RenderComponent.install = function (Vue) {
    Vue.component(RenderComponent.name, RenderComponent)
}

export default {
    name: 'RenderComponent',
    props: {
        content: Function,
        config: Object
    },
    render(createElement) {
        return this.content.call(this, createElement, this.config)
    }
}
