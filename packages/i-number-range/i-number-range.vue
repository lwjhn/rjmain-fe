<template>
    <div class="i-number-range">
        <el-input-number v-model="currentValue[0]" v-bind="Object.assign({'controls-position': 'right'}, bind, bind0)"
                         v-on="Object.assign({}, on, on0)"></el-input-number>
        <span class="el-range-separator">
            <slot></slot>
        </span>
        <el-input-number v-model="currentValue[1]" v-bind="Object.assign({'controls-position': 'right'}, bind, bind1)"
                         v-on="Object.assign({}, on, on1)"></el-input-number>
    </div>
</template>

<script>
export default {
    name: "INumberRange",
    props: {
        value: [Array],
        bind: Object,
        on: Object,
        bind0: Object,
        on0: Object,
        bind1: Object,
        on1: Object,
        rangeSeparator: String
    },
    data() {
        return {
            currentValue: (Array.prototype.isPrototypeOf(this.value) ? this.value : []).concat([undefined, undefined]).slice(0, 2)
        }
    },
    watch: {
        currentValue(val) {
            this.$emit('input', val)
        }
    }
}
</script>

<style scoped>
.i-number-range {
    display: flex;
}

.i-number-range div {
    flex-grow: 2;
}

.i-number-range span {
    padding: 0 6px;
}
</style>
