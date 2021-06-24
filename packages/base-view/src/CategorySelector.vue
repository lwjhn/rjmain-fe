<template>
    <ul class="cl-search-category-ul">
        <li class="cl-search-category-li" v-for="(item, index) in options">
            <label>{{ item.label }}：</label>
            <el-select v-model="item.value"
                       @change="change(item, index)" :style="{
                           width : item.width ? item.width : '100px'
                       }"
                       no-data-text="无"
                       class="cl-search-category-selector">
                <el-option v-for="(option, pos) in item.options"
                           :key="'option-'+pos"
                           :label="option.label"
                           :value="option.value">
                </el-option>
            </el-select>
        </li>
    </ul>
</template>
<script>
/**
 * options: [
 *      {
 *          label: '年度',
 *          value: '',
 *          options: [{
 *              label: 2021,
 *              value: 2021
 *          }]
 *      }
 * ]
 */
export default {
    name: "CategorySelector",
    props: {
        options: {
            label: String,
            value: Object,
            options: Array
        }
    },
    data() {
        return {}
    },
    methods: {
        change(item, index) {
            this.$emit('change', item, this.options, index)
        }
    }
}
</script>

<style lang="scss" scoped>
ul.cl-search-category-ul {
    li.cl-search-category-li {
        display: inline;

        .cl-search-category-selector {
            margin-right: 18px;
        }
    }
}
</style>
