import libs from '../../../lib/utils'

export default {
    ...libs,
    /**
     * @param query - {
                where:{
                    expression：String
                    value:Array
                }
            }
     * @param expression - String
     * @param value - Array,String,...
     * @param type - 'AND','OR'
     */
    sql(query, expression, value, type, key) {
        if(!expression)
            return query
        let criteria = {
            expression: [],
            value: []
        }
        if (!key) key = 'where'
        let where = query[key]
        if (where && where.expression) {
            criteria.expression.push(/^(\s)*\(/.test(where.expression) ? where.expression : `(${where.expression})`)
            if (where.value) criteria.value = where.value
        }
        this.criteria(criteria, expression, value)
        query[key] = Object.assign(where ? where : {}, {
            expression: criteria.expression.join(/^or$/i.test(type) ? ' OR ' : ' AND '),
            value: criteria.value
        })
        return query
    },
    /**
     * @param criteria - {
                    expression：Array
                    value: Array
            }
     * @param expression - String
     * @param value - Array,String,...
     */
    criteria(criteria, expression, value) {
        if(!expression)
            return criteria
        if (!criteria.value) criteria.value = []
        let formula = expression.match(/\?/g)
        if (formula) {
            let mode = Array.prototype.isPrototypeOf(value)
            formula.forEach((o, i) => {
                criteria.value.push(mode ? value[i] : value)
            })
        }
        criteria.expression.push(/^(\s)*\(/.test(expression) ? expression : `(${expression})`)
        return criteria
    }
}
