import BaseView from './src/BaseView.vue'

BaseView.install = function (Vue) {
    Vue.component(BaseView.name, BaseView)
}

export default BaseView
