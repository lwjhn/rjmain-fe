<template>
  <pagination-table-new ref="refPagination"
                        @table:row-click="rowClick.apply(_self, arguments)"
                        @fetchTableData="fetchTableData"
  >
    <div slot="header-left">
      <category-selector
          :options="categoryOption"
          @change="changeCategory"
      >
      </category-selector>
    </div>
    <div slot="buttons" v-if="buttons">
      <el-button v-for="(item, index) in buttons"
                 :key="index"
                 @click="item.handle ? item.handle() : ()=>{}"
                 :type="item.type ? item.type : 'primary'"
                 :title="item.title ? item.title : ''"
      > {{ item.label ? item.label : `按钮${index}` }}
      </el-button>
    </div>
    <template slot="search" v-if="search"
              slot-scope="{where}">
      <el-form-item v-for="(item, index) in search"
                    :key="index"
                    :label="item.label"
                    :prop="item.alias"
      >
        <el-date-picker
            v-if="item.type === 'date'"
            v-model="item.value" @input="forceUpdate()"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
        >
        </el-date-picker>

        <el-input
            v-else
            v-model="item.value" @input="forceUpdate()"
            clearable
            @keydown.enter.prevent.native></el-input>
      </el-form-item>
    </template>
    <template slot-scope="{pagination}">
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
          :label="item.label"
          :key="index"
          :width="item.width ? item.width : ''"
          :sortable="item.sortable ? 'custom' : null"
          :prop="item.alias"
          v-if="!item.hidden"
      >
        <template slot-scope="scope">
          {{
            typeof (item.format) == 'function' ? item.format.call(_self, item, scope.row) : (scope.row[item.alias])
          }}
        </template>
      </el-table-column>
    </template>
  </pagination-table-new>
</template>
<script>
import CategorySelector from './CategorySelector.vue'
import baseData from '../lib/config'
import PaginationTable from 'o-ui/packages/pagination-table'
import $rj from "../lib/utils"
import axios from 'axios'

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
  components: {CategorySelector, PaginationTableNew},
  data() {
    return $rj.extend(true, {
      lastRequest: null,
      cancelSource: null,
      cancelCategory: null,
      categoryOption: [],
      lastCategory: []
    }, baseData)
  },
  computed: {},
  watch: {},
  methods: {
    changeCategory(item, options, index) {
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
      this.loadCategory()
      this.refresh(true)
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
        throw new Error("The number of category cannot be less than 0 .");

      let request = {
        fields,
        order: [`${cat.alias} ${cat.desc ? 'DESC' : 'ASC'}`],
        limit: [0, 1000],
        group: fields[0]
      }
      this.setCategoryCriteria(request, this.lastCategory)
      this.beforeRequest(request, this.lastCategory, true)

      if (this.cancelCategory && typeof this.cancelCategory.cancel === 'function')     // 取消上一次请求
        this.cancelCategory.cancel();
      this.cancelCategory = axios.CancelToken.source();
      this.$utils.ajax({
        url: this.categoryUrl ? this.categoryUrl : this.url,
        method: 'post',
        params: {},
        data: request,
        cancelToken: this.cancelCategory.token
      }).then(data => {
        this.afterRequest(request, data, true)
        data = (Array.prototype.isPrototypeOf(data) ? data : data.list)
        if (Array.prototype.isPrototypeOf(data)) {
          let value;
          data = data.map(o => {
            value = o ? o[cat.alias] : o
            return {lable: value, value}
          })
        }

        data.unshift({
          label: '全部',
          value: _ALL_CATEGORY_
        })
        this.categoryOption.splice(level, this.categoryOption.length - level, {
          label: cat.label,
          width: cat.width,
          value: _ALL_CATEGORY_,
          options: data
        })
      }).catch(err => {
        this.$message.error(err.message)
      }).finally(() => {
        return typeof callback === 'function' ? callback() : null
      })
    },
    forceUpdate() {
      this.$forceUpdate()
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
          limit = [(page - 1) * pageSize, page * pageSize],
          fields = this.columns.map(o => ({
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
          } = item.criteria(item)) && /\?/g.test(expression)) {

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
      this.setCategoryCriteria(query, this.lastCategory)
      this.beforeRequest(query, this.lastCategory)
      return query
    },
    setCategoryCriteria(query, categories) {
      if(!categories) return;
      categories.forEach(item => {
        let {expression, value} = item
        if (typeof item.criteria === 'function' && ({
          expression,
          value
        } = item.criteria(item)) && expression && /\w/.test(expression)) {

        } else if((expression=item.expression) && /\w/.test(expression)){
          expression = `${ item.expression } ${ item.value === null ? 'IS NULL' : '= ?'}`
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

      $this.loading = true;
      if (this.cancelSource && typeof this.cancelSource.cancel === 'function')     // 取消上一次请求
        this.cancelSource.cancel();
      this.cancelSource = axios.CancelToken.source();

      this.$utils.ajax({
        url: this.url,
        method: 'post',
        params: {},
        data: request,
        cancelToken: this.cancelSource.token
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
      //this.$refs.refPagination.refresh(jumpToFirst);
      let $this = this.$refs.refPagination;
      if (!jumpToFirst || $this.pagination.currentPage === 1) {
        $this.fetchTableData()
      } else {
        $this.pagination.currentPage = 1;
      }
    },
    init(config) {
      if (!config)
        throw new Error('BaseView Error :: view must not be null ');

      config = $rj.extend(true, {}, config)
      let option
      for (let key in baseData) {
        if (!(option = config[key]))
          continue
        this[key] = option
      }
      if (this.category) this.category.forEach((o, i) =>
          o.alias = o.alias ? o.alias.toString() : '_DEF_CAT_' + i)
      this.columns.forEach((o, i) =>
          o.alias = o.alias ? o.alias.toString() : '_DEF_COL_' + i)
      if (this.search) this.search.forEach((o, i) =>
          o.value = undefined)

      this.loadCategory()
      this.refresh(true)
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
    this.import(typeof this.view === 'function' ? this.view.call(this) : this.view)
  },
  created() {
    this.$rj = $rj
  }
}
</script>