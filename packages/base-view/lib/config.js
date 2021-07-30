export default {
    url: '',
    categoryUrl: '',
    selection: true,
    category: [/*{
                    expression: 'year(eventTime)',
                    //value:[],   //expresion参数
                    label: '事发时间',
                    width: '80px', //minWidth: 180,
                    desc: true,
                    //criteria(item){}  //可选
        }*/],
    columns: [/*{
                    expression: 'eventTime',
                    label: '事发时间',
                    width: '180',
                    sortable: true, //默认排序配置为 DESC ASC
                    format: function (val) {},
                    name:'eventTime',   //驼峰命名，别名或下划线二选一
                    alias: 'EVENT_TIME',    //驼峰转下划线
                    hidden: true
        }*/],
    buttons: [/*{
            label: '打印',
            title: '打印',
            type: 'primary',
            handle(){}
    }*/],
    search: [/*{
                label: '事发时间',
                type: 'date',   //date, number, boolean
                criteria(item){
                    return item.value ? {
                        expression: `eventTime>=?${item.length > 1 ? ' AND eventTime<=?' : ''}`,
                        value: item.value
                    } : null
                }
             }, {
                label: '报送单位',
                expression: 'reportUnitName = ?',
    }*/],
    keyword: '', //eventTime LIKE ?
    rowClick() {
    },
    beforeRequest(query, category, isCategory) {
    },
    afterRequest(request, response, isCategory) {
    }
}
