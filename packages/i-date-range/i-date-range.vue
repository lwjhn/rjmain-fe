<template>
    <div class="i-date-range">
        <el-date-picker v-model="currentValue[0]"
                        v-bind="Object.assign({type:'date', placeholder: '开始日期'}, bind, bind0)"
                        v-on="Object.assign({}, on, on0)">
        </el-date-picker>
        <span class="el-range-separator">
            <slot></slot>
        </span>
        <el-date-picker v-model="currentValue[1]"
                        v-bind="Object.assign({type:'date', placeholder: '结束日期'}, bind, bind1)"
                        v-on="Object.assign({}, on, on1)">
        </el-date-picker>
    </div>
</template>

<script>
export default {
    name: "IDateRange",
    props: {
        value: [Array, Object],
        bind: Object,
        on: Object,
        bind0: Object,
        on0: Object,
        bind1: Object,
        on1: Object
    },
    data() {
        return {
            currentValue: (Array.prototype.isPrototypeOf(this.value) ? this.value : []).concat([null, null]).slice(0, 2)
        }
    },
    watch: {
        currentValue(val) {
            this.$emit('input', val)
        }
    }
}
</script>

<style lang="scss" scoped>
.i-date-range {
    display: flex;

    div {
        flex-grow: 2;
    }
}
</style>
