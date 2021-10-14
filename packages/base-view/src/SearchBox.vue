<template>
    <div class="search-box">
        <div class="search-panel-col" v-for="(col, index) in search" :key="index" :style="{
            width: col.width ? col.width : 'auto'
        }">
            <search-component v-if="typeof col === 'function'" :render-content="col" :config="col"></search-component>
            <search-panel v-else class="search-panel-item" :config="col"></search-panel>
        </div>
    </div>
</template>
<script>
/*[{
    label: '订阅年份',
    value: _ALL_CATEGORY_,
    colSpan: '50%',
    width: '100%',
    criteria(item) {
        return item.value && item.value !== _ALL_CATEGORY_ ? {
            expression: `${tableAlias}subscribeYear=?`,
            value: item.value
        } : null
    },
    type: 'select',   //date, number, select, radio, checkbox, other
    options: [_ALL_CATEGORY_OPTION_],
    remote: {
        expression: `${tableAlias}subscribeYear`,
        //value:[],   //expresion参数
        //group: 'subscribeYear', //可选
        desc: true,
    }
}]*/

import SearchPanel from './SearchPanel'

export default {
    name: "SearchBox",
    components: {
        SearchPanel,
        SearchComponent: {
            props: {
                renderContent: Function,
                config: Object
            },
            render(createElement) {
                return this.renderContent.call(this, createElement, this.config)
            }
        }
    },
    props: {
        search: {
            type: Array,
            request: true
        }
    }
}
</script>

<style lang="scss" scoped>
.search-box {
    .search-panel-col {
        display: inline-block;
        margin: 0 0;
        padding: 0 0;

        .el-form-item.search-panel-item {
            display: inline-table !important;
            width: 100%;

            /deep/ label.el-form-item__label {
                width: 100px;
                display: table-cell;
                text-align: right;

                /*white-space: nowrap;
                word-wrap: break-word;
                word-break: break-all;

                text-align: justify;
                -moz-text-align-last: justify;
                -webkit-text-align-last: justify;
                text-align-last: justify;
                text-justify: inter-ideograph;*/
            }

            /deep/ .el-form-item__content {
                width: 100%;

                > *, .el-input-number, .el-input__inner {
                    width: 100%;
                }
            }

            /*
                        &::after {
                            clear: both;
                            width: 30px;
                            display: table-cell;
                        }*/
        }
    }

    /deep/ .el-date-editor .el-range-separator {
        width: auto;
    }
}
</style>
