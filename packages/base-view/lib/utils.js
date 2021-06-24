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
    sql(query, expression, value, type) {
        let criteria = {
            expression: [],
            value: []
        }
        if (query.where && query.where.expression) {
            criteria.expression.push(/^(\s)*\(/.test(query.where.expression) ? query.where.expression : `(${query.where.expression})`)
            criteria.value = query.where.value
        }
        this.criteria(criteria, expression, value)
        query.where = {
            expression: criteria.expression.join(/^or$/i.test(type) ? ' OR ' : ' AND '),
            value: criteria.value
        }
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
