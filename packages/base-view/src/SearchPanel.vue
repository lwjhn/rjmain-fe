<template>
    <el-form-item v-bind="config">
        <el-select v-if="/select/i.test(config.type)" v-model="config.value" filterable
                   :multiple="config.multiple"
                   placeholder="请选择">
            <el-option
                v-for="(item, pos) in config.options"
                :key="pos" v-if="item"
                :label="item.label"
                :value="item.value!==undefined ? item.value : item.label">
            </el-option>
        </el-select>
        <el-checkbox-group v-else-if="/checkbox/i.test(config.type)"
                           v-model="config.value">
            <el-checkbox
                v-for="(item, pos) in config.options"
                :key="pos" v-if="item"
                :label="item.value!==undefined ? item.value : item.label">{{ item.label }}
            </el-checkbox>
        </el-checkbox-group>
        <el-radio-group v-else-if="/radiobutton/i.test(config.type)"
                        v-model="config.value">
            <el-radio-button
                v-for="(item, pos) in config.options"
                :key="pos" v-if="item"
                :label="item.value!==undefined ? item.value : item.label">{{ item.label }}
            </el-radio-button>
        </el-radio-group>
        <el-radio-group v-else-if="/radio/i.test(config.type)">
            <el-radio
                v-for="(item, pos) in config.options"
                :key="pos" v-if="item"
                :label="item.value!==undefined ? item.value : item.label">{{ item.label }}
            </el-radio>
        </el-radio-group>
        <el-input-number v-else-if="/number/i.test(config.type)"
                         v-model="config.value" controls-position="right"
                         :step="typeof config.step === 'number' ? config.step : 1"
                         :min="config.min ? config.min : 0"
                         :max="config.max ? config.max : 999999999999999"
        ></el-input-number>
        <el-date-picker v-else-if="/date/i.test(config.type)"
                        v-model="config.value"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-input v-else v-model="config.value" @input="$forceUpdate()" clearable
                  @keydown.enter.prevent.native></el-input>
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
export default {
    name: "SearchPanel",
    props: {
        config: {
            type: Object,
            request: true
        }
    }
}
</script>

<style scoped>

</style>
