<template>
    <pagination-table-new class="base-pagination-table" ref="refPagination"
                          @table:row-click="rowClick.apply(_self, arguments)"
                          @fetchTableData="fetchTableData"
                          :table_default-sort.sync="defaultSort"
                          @table:selection-change="selection = $event"
                          v-bind="bind"
    >
        <div slot="header-left">
            <category-selector v-if="isLoadedCategory"
                               :options="categoryOption"
                               @change="changeCategory"
            >
            </category-selector>
        </div>
        <div slot="buttons" v-if="buttons">
            <el-button v-for="(item, index) in buttons"
                       :key="index"
                       @click="item.handle ? item.handle.call(_self) : ()=>{}"
                       v-bind="Object.assign({}, item, {on: undefined, handle: undefined})"
                       v-on="item.on">
                {{ item.label ? item.label : `按钮${index}` }}
            </el-button>
            <div class="table-extension-html" v-if="html" v-html="html"></div>
        </div>
        <search-box slot="search" v-if="search" slot-scope="{where}" :search="search"></search-box>
        <!--        <template slot="search" v-if="search" slot-scope="{where}">
                          <search-panel class="search-panel-item" :config="col" v-for="(col, index) in search" :style="{
                              width: col.colSpan ? col.colSpan : '',
                          }" :key="index">
                          </search-panel>
                </template>-->
        <template slot-scope="{pagination}" v-if="columns && columns.length>0">
            <el-table-column v-if="selection" type="selection"
                             width="55">
            </el-table-column>
            <el-table-column type="index"
                             width="80"
                             label="序号"
                             :index="(index) => { return (pagination.currentPage-1) * pagination.pageSize + index + 1; }">
            </el-table-column>

            <el-table-column
                v-for="(item,index) in columns"
                :key="index"
                v-if="!item.hidden"
                v-bind="Object.assign({prop: item.alias}, item, {
                    sortable: item.sortable ? 'custom' : null,
                    expression: undefined,
                    value: undefined,
                    format: undefined,
                    bind: undefined
                })">
                <div slot-scope="scope" v-bind="item.bind" v-on="item.on">
                    {{
                        typeof (item.format) == 'function' ? item.format.call(_self, item, scope.row)
                            : (scope.row.hasOwnProperty(item.name) ? scope.row[item.name] : scope.row[item.alias])
                    }}
                </div>
            </el-table-column>
        </template>
    </pagination-table-new>
</template>
<script>
import SearchBox from "./SearchBox";
import CategorySelector from './CategorySelector.vue'
import baseData from '../lib/config'
import PaginationTable from 'o-ui/packages/pagination-table'
import $rj from "../lib/utils"
import ajax from "@rongji/rjmain-fe/lib/ajax"

const PaginationTableNew = {
    name: 'PaginationTableNew',
    methods: {
        fetchTableData() {
            this.$emit('fetchTableData', this)
        }
    },
    extends: PaginationTable
}
const _ALL_CATEGORY_ = () => {
}

export default {
    name: 'BaseView',
    props: ['view'],
    components: {CategorySelector, PaginationTableNew, SearchBox},
    data() {
        return $rj.extend(true, {
            lastRequest: null,
            cancelSource: null,
            cancelCategory: null,
            categoryOption: [],
            lastCategory: [],
            defaultSort: {},
            selection: []
        }, baseData, {
            isLoadedCategory: false, httpRequest: new XMLHttpRequest(), httpRequest4Category: new XMLHttpRequest()
        })
    },
    computed: {},
    watch: {},
    methods: {
        updateLastCategory(options, index) {
            this.lastCategory = []
            for (let i = 0, o; i <= index; i++) {
                if (i >= this.categoryOption.length)
                    break
                o = options[i]
                if (o.value === _ALL_CATEGORY_) {
                    this.categoryOption.splice(i + 1, this.categoryOption.length - i - 1)
                    break
                }
                this.lastCategory.push($rj.extend({}, this.category[i], o))
            }
        },
        changeCategory(item, options, index, callback) {
            this.updateLastCategory(options, index)
            if (typeof callback === 'function') {
                this.loadCategory(callback)
            } else {
                this.loadCategory()
                if (this.isLoadedCategory) {
                    this.refresh(true)
                }
            }
        },
        loadCategory(callback) {
            let level = this.lastCategory.length
            if (!this.category || this.category.length < 1 || this.category.length <= level)
                return typeof callback === 'function' ? callback() : null
            let cat = this.category[level],
                fields = [{
                    expression: cat.expression,
                    alias: cat.alias,
                    value: cat.value
                }]
            if (fields.length < 1)
                throw new Error("The number of category cannot be less than 0 .")
            let request = {
                fields,
                order: [`${cat.alias} ${cat.desc ? 'DESC' : 'ASC'}`],
                limit: [0, 1000],
                group: cat.group ? cat.group : fields[0]
            }
            this.setCategoryCriteria(request, this.lastCategory)
            this.beforeRequest(request, this.lastCategory, true)
            if (typeof cat.beforeRequest === 'function') {
                cat.beforeRequest.call(this, request, cat)
            }
            ajax({
                url: this.categoryUrl ? this.categoryUrl : this.url,
                method: 'post',
                params: {},
                data: request,
                httpRequest: this.httpRequest4Category
            }).then(data => {
                this.afterRequest(request, data, true)
                data = (Array.prototype.isPrototypeOf(data) ? data : data.list)
                let defultValue = _ALL_CATEGORY_,
                    originDefultValue = typeof cat.defaultValue === 'function' ? cat.defaultValue.call(this, data, cat, defultValue) : cat.defaultValue
                if (Array.prototype.isPrototypeOf(data)) {
                    let value;
                    data = data.map(o => {
                        value = o ? (o.hasOwnProperty(cat.name) ? o[cat.name] : o[cat.alias]) : o
                        if (originDefultValue != null && originDefultValue == value)
                            defultValue = value
                        return {lable: value, value}
                    })
                }
                cat.defaultValue = null

                data.unshift({
                    label: '全部',
                    value: _ALL_CATEGORY_
                })

                this.categoryOption.splice(level, this.categoryOption.length - level, {
                    label: cat.label,
                    width: cat.width,
                    value: defultValue,
                    options: data,
                    bind: cat.bind,
                    on: cat.on
                })
                if (typeof cat.beforeRequest === 'function') {
                    cat.beforeRequest.call(this, request, cat)
                }
                if (defultValue !== _ALL_CATEGORY_) {
                    if (typeof cat.beforeCreate === 'function') {
                        cat.beforeCreate.call(this, data, this.categoryOption, level)
                    }
                    cat.defaultValue = null
                    this.changeCategory(data, this.categoryOption, level, callback)
                } else {
                    typeof callback === 'function' ? callback() : null
                }
            }).catch(err => {
                this.$message.error(err.message)
            }).finally(() => {

            })
        },
        generateCriteria($this) {
            let page = $this.pagination && $this.pagination.currentPage ? $this.pagination.currentPage : 1,
                pageSize = $this.pagination.pageSize,
                keyword = $this.keyword,
                fulltext = $this.fulltext,
                sort = $this.table && $this.table.defaultSort ? $this.table.defaultSort : null

            let order = sort && sort.order && sort.prop
                ? [(sort.order === 'descending' ? `${sort.prop} DESC` : `${sort.prop} ASC`)]
                : [],
                limit = [(page - 1) * pageSize, pageSize],
                fields = this.columns.filter(o => o && o.expression).map(o => ({
                    expression: o.expression,
                    alias: o.alias,
                    value: o.value
                }))
            if (fields.length < 1)
                throw new Error("The number of columns cannot be less than 0 .");

            let query = {
                fields,
                order,
                limit
            }, criteria = {
                expression: [],
                value: []
            }, expression

            if ($this.searchFormVisible) {  // 高级搜索表单显示
                let value
                this.search.forEach(item => {
                    if (!item.value) return
                    if (typeof item.criteria === 'function' && ({
                        expression,
                        value
                    } = ((value = item.criteria(item)) ? value : {})) && expression) {

                    } else if (/\?/g.test(expression = item.expression)) {
                        value = item.value
                    } else
                        return
                    $rj.criteria(criteria, expression, value)
                })
            } else {        // 高级搜索表单不显示
                if (keyword && this.keyword && (expression = this.keyword.match(/\?/g))) {     // 关键字存在
                    expression.forEach(o => {
                        criteria.value.push(`%${keyword}%`)
                    })
                    criteria.expression.push(/^(\s)*\(/.test(this.keyword) ? this.keyword : `(${this.keyword})`)
                }
                /*if (this.showFulltextCheckbox) {
                    // 显示全文搜索的checkbox
                    if (fulltext) {
                        // 如果fulltext等于true
                        params[this.fulltextName] = fulltext;
                    }
                }*/
            }
            expression = $rj.joinArray(criteria.expression, ' AND ', '(', ')')
            if (expression) {
                query.where = {
                    expression,
                    value: criteria.value
                }
            }
            if(!$this.searchFormVisible){
                this.setCategoryCriteria(query, this.lastCategory)
            }
            this.beforeRequest(query, this.lastCategory)
            return query
        },
        setCategoryCriteria(query, categories) {
            if (!categories) return;
            categories.forEach(item => {
                let {expression, value} = item
                if (typeof item.criteria === 'function' && ({
                    expression,
                    value
                } = item.criteria(item)) && expression && /\w/.test(expression)) {

                } else if ((expression = item.expression) && /\w/.test(expression)) {
                    expression = `${item.expression} ${item.value === null ? 'IS NULL' : '= ?'}`
                    value = item.value
                } else
                    return
                $rj.sql(query, expression, value)
            })
        },
        fetchTableData($this) {
            if (!this.url) return
            let request
            try {
                request = this.generateCriteria($this)
            } catch (e) {
                return this.$message.error(e.message)
            }

            $this.loading = true
            ajax({
                url: this.url,
                method: 'post',
                params: {},
                data: request,
                httpRequest: this.httpRequest
            }).then(response => {
                this.afterRequest(this.lastRequest = request, response)
                $this.table.data = response.list    //$this.dataFreeze ? Object.freeze(response.list) : response.list;
                $this.pagination.total = parseInt(response.total)
                this.$nextTick(() => {
                    $('.el-table-column--selection').click((e) => {
                        e.stopPropagation()
                        e.preventDefault()
                    })
                })
            }).catch(err => {
                this.$message.error(err.message)
            }).finally(() => {
                $this.loading = false;
            })
        },
        refresh(jumpToFirst) {
            let page
            if (page = this.$refs.refPagination) {
                page.refresh(jumpToFirst)
            }
        },
        init(config) {
            if (!config)
                throw new Error('BaseView Error :: view must not be null ')
            const originSearch = config.search

            config = $rj.extend(true, {}, config)
            let option
            for (let key in baseData) {
                if (!(option = config[key]))
                    continue
                this[key] = option
            }
            if (originSearch) {
                originSearch.forEach((o, i) =>
                    o.hasOwnProperty('options') ? this.search[i].options = o.options : null)
            }

            if (this.category)
                this.category.forEach((o, i) => this.initializeName(o, 'CAT_' + i))

            let dSort = {}
            this.columns.forEach((o, i) => {
                this.initializeName(o, 'COL_' + i)
                if (/des|asc/i.test(o.sortable))
                    dSort = {prop: o.alias, order: /des/i.test(o.sortable) ? 'descending' : 'ascending'}
            })
            /*if (this.search) this.search.forEach((o, i) =>
                o.value = undefined)*/
            this.isLoadedCategory = false
            this.loadCategory(() => {
                this.defaultSort = dSort
                this.isLoadedCategory = true
                //pagination
                this.refresh(true)
            })
        },
        initializeName(o, suffix) {
            if (!o.alias && o.name)
                o.alias = $rj.camelToUpperUnderscore(o.name)
            o.name = $rj.underscoreToLowerCamel(o.alias = o.alias ? o.alias.toString() : '_DEF_' + suffix)
        },
        import(link) {
            if (typeof link === 'string') {
                link = import(`${link}`)
            } else if (typeof link === 'function')
                link = link.call(this)

            if (!Promise.prototype.isPrototypeOf(link))
                return this.init(link)
            link.then((module) => {
                this.init(typeof (link = module.default) === 'function' ? link.call(this) : link)
            }).catch(err => {
                throw err
            })
        }
    },
    mounted() {

    },
    created() {
        this.$rj = $rj
        this.import(typeof this.view === 'function' ? this.view.call(this) : this.view)
    }
}
</script>
<style lang="scss" scoped>

</style>
