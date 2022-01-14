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
        if (!expression)
            return query
        let criteria = {
            expression: [],
            value: []
        }
        if (!key) key = 'where'
        let where = query[key]
        if (where && where.expression) {
            criteria.expression.push(/^group|order$/i.test(key) || /^(\s)*\(/.test(where.expression) ? where.expression : `(${where.expression})`)
            if (where.value) criteria.value = where.value
        }
        this.criteria(criteria, expression, value, /^group|order$/i.test(key))
        query[key] = Object.assign(where && typeof where !== 'string' ? where : {}, {
            expression: criteria.expression.join(!!type ? type : (/^group|order$/i.test(key) ? ', ' : (/^or$/i.test(type) ? ' OR ' : ' AND '))),
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
    criteria(criteria, expression, value, nonBracket) {
        if (!expression)
            return criteria
        if (!criteria.value) criteria.value = []
        let formula = expression.match(/\?/g)
        if (formula) {
            let mode = Array.prototype.isPrototypeOf(value)
            formula.forEach((o, i) => {
                criteria.value.push(mode ? value[i] : value)
            })
        }
        criteria.expression.push(nonBracket || /^(\s)*\(/.test(expression) ? expression : `(${expression})`)
        return criteria
    },
    sqlAlias2Expression(query, key, callAlias, callExpression, appending) {
        let order = query[key]
        if ((!order || (typeof order !== 'string' && !Array.prototype.isPrototypeOf(order))) && !appending)
            return query
        let criteria = {
            expression: [],
            value: []
        }, fields = query.fields;
        (Array.prototype.isPrototypeOf(appending) ? [order, ...appending] : [order, appending]).forEach(item => {
            if (!item) {
            } else if (typeof item !== 'string' && !Array.prototype.isPrototypeOf(item)) {
                this.criteria(criteria, item.expression, item.value, true)
            } else {
                (Array.prototype.isPrototypeOf(item) ? item : item.split(/,\s|;\s|,|;/g)).map(key => {
                    let alias = callAlias.call(this, key)
                    let {expression, value} = callExpression.call(this, key, fields.find(item => {
                        return item.alias ? item.alias.trim() === alias : item.expression.trim() === alias
                    }))
                    this.criteria(criteria, expression, value, true)
                })
            }
        })
        query[key] = {
            expression: criteria.expression.join(', '),
            value: criteria.value
        }
        return query
    },
    sqlAlias2Expression4Order(query, callExpression, appending) {
        return this.sqlAlias2Expression(query, 'order',
            key => (key = key.trim()).replace(/\s+(asc|desc)$/i, ''),
            typeof callExpression === 'function' ? callExpression : (key, field) => {
                return {
                    expression: `${field.expression} ${/\s+asc$/i.test(key) ? 'ASC' : 'DESC'}`,
                    value: field.value
                }
            },
            appending
        )
    },
    sqlAlias2Expression4Group(query, callExpression, appending) {
        return this.sqlAlias2Expression(query, 'group',
            key => key,
            typeof callExpression === 'function' ? callExpression : (key, field) => field,
            appending
        )
    },
    date2Criteria(expression, value, template) {
        if (!Array.prototype.isPrototypeOf(value) || value.length < 1)
            return null
        if (!template) {
            template = [{operator: '>=', format: 'yyyy-MM-dd 00:00:00.000000'}, {
                operator: '<=',
                format: 'yyyy-M-d 23:59:59.999999'
            }]
        }
        let exp = [], val = []
        value.forEach((dateTime, index) => {
            if (!!(dateTime = this.string2Date(dateTime))) {
                exp.push(`${expression} ${template[index].operator} ?`)
                val.push(this.formatDate(dateTime, template[index].format))
            }
        })
        return {
            expression: exp.join(' AND '),
            value: val
        }
    }
}
