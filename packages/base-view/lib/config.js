export default {
    url: '',
    categoryUrl: '',
    selection: true,
    category: [/*{
                    expression: 'year(eventTime)',
                    //value:[],   //expresion参数
                    label: '事发时间',
                    width: '80px',
                    desc: true,
                    //criteria(item){}  //可选
                    //group //可选
                    //defaultValue 默认值
        }*/],
    columns: [/*{
                    expression: 'eventTime',
                    label: '事发时间',
                    width: '180', //minWidth: 180,
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
    search: [
        /*{
            label: '事发时间',
            type: 'date',    //date, number, select, radio, checkbox, other
            //value: '',
            criteria(item) {
                return item.value ? {
                    expression: `eventTime>=?${item.length > 1 ? ' AND eventTime<=?' : ''}`,
                    value: item.value
                } : null
            },
            //value:'',
            //options: [{label,value}]  //select, radio, checkbox使用
        }, {
            label: '报送单位',
            expression: 'reportUnitName = ?', select, radio, checkbox
        }*/
    ],
    keyword: '', //eventTime LIKE ?
    rowClick() {
    },
    beforeRequest(query, category, isCategory) {
    },
    afterRequest(request, response, isCategory) {
    },
    html: '',
    bind: {
        /*pagination_pageSize: 50*/
    }
}
