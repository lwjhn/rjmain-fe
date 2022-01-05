<template>
    <el-form-item v-bind="Object.assign({}, config, {
        width: undefined, type: undefined , value: undefined, criteria: undefined, bind: undefined
    })">
        <dynamic-component v-if="Object.prototype.toString.call(config.type) === '[object Promise]'" :compact="config.type" v-bind="config.bind" v-on="config.on"></dynamic-component>
        <render-component v-else-if="typeof config.type === 'function'" :content="config.type" :config="config"></render-component>
        <el-select v-else-if="/select/i.test(config.type)" v-model="config.value"
                   v-on="config.on"
                   v-bind="Object.assign({filterable: true}, config.bind)">
            <el-option
                v-for="(item, pos) in config.options"
                :key="pos" v-if="item"
                :label="item.label"
                :value="item.value!==undefined ? item.value : item.label">
            </el-option>
        </el-select>
        <el-checkbox-group v-else-if="/checkbox/i.test(config.type)"
                           v-model="config.value" v-bind="config.bind" v-on="config.on">
            <el-checkbox
                v-for="(item, pos) in config.options"
                :key="pos" v-if="item"
                :label="item.value!==undefined ? item.value : item.label">{{ item.label }}
            </el-checkbox>
        </el-checkbox-group>
        <el-radio-group v-else-if="/radiobutton/i.test(config.type)"
                        v-model="config.value" v-bind="config.bind" v-on="config.on">
            <el-radio-button
                v-for="(item, pos) in config.options"
                :key="pos" v-if="item"
                :label="item.value!==undefined ? item.value : item.label">{{ item.label }}
            </el-radio-button>
        </el-radio-group>
        <el-radio-group v-else-if="/radio/i.test(config.type)" v-model="config.value" v-bind="config.bind"
                        v-on="config.on">
            <el-radio
                v-for="(item, pos) in config.options"
                :key="pos" v-if="item"
                :label="item.value!==undefined ? item.value : item.label">{{ item.label }}
            </el-radio>
        </el-radio-group>
        <el-input-number v-else-if="/number/i.test(config.type)"
                         v-model="config.value" controls-position="right"
                         v-bind="Object.assign({
                            step: 1, min:0, max: 999999999999999
                        }, config.bind)" v-on="config.on"
        ></el-input-number>
        <el-date-picker v-else-if="/date/i.test(config.type)"
                        v-model="config.value"
                        v-bind="Object.assign({
                            type:'daterange',
                            align:'right',
                            unlinkPanels: true,
                            rangeSeparator:'至',
                            startPlaceholder:'开始日期',
                            endPlaceholder:'结束日期'
                        }, config.bind)" v-on="config.on"
        >
        </el-date-picker>
        <el-input v-else v-model="config.value" @input="$forceUpdate()" clearable
                  @keydown.enter.prevent.native v-bind="config.bind" v-on="config.on"></el-input>
    </el-form-item>
</template>
<script>
/*{
    label: '订阅年份',
    value: _ALL_CATEGORY_,
    criteria(item) {
        return item.value && item.value !== _ALL_CATEGORY_ ? {
            expression: `${tableAlias}subscribeYear=?`,
            value: item.value
        } : null
    },
    type: 'select',   //date, number, select, radio, checkbox, other
    options: [_ALL_CATEGORY_OPTION_]
}*/
import DynamicComponent from '../../dynamic-component'
import RenderComponent from '../../render-component'

export default {
    name: "SearchPanel",
    props: {
        config: {
            type: Object,
            request: true
        }
    },
    components: {
        RenderComponent,
        DynamicComponent
    }
}
</script>

<style scoped>

</style>
