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
        }*/],
    columns: [/*{
                    expression: 'eventTime',
                    label: '事发时间',
                    width: '180',
                    sortable: true,
                    format: function (val) {},
                    alias: '',
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
