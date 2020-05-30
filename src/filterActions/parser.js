import moment from 'moment';
import { isEmpty } from 'lodash';
import { LOGICAL_DATA_TYPE_FILTER, LOGICAL_OPERATORS_FILTER, LOGICAL_CASE_FILTER, PARAMS_MAP_SERVER } from '../const';

const checkDateValid = date => {
    const dateState = moment(new Date(date));
    return moment(dateState).isValid();
};

const filterParser = data => {
    if (isEmpty(data)) {
        return null;
    }
    const { method, fitlers } = data;
    const result = [];
    fitlers.forEach(f => {
        const { key, dataType, dataCase, op, value } = f;
        if (key === '') {
            return;
        }
        const formatedItem = {};
        let dataFormated = null;
        switch (dataType) {
            case LOGICAL_DATA_TYPE_FILTER.BOOLEAN:
                Object.assign(formatedItem, {
                    [key]: {
                        [PARAMS_MAP_SERVER.OP]: op,
                        [PARAMS_MAP_SERVER.VALUE]: Boolean(value) || null,
                    },
                });
                break;
            case LOGICAL_DATA_TYPE_FILTER.SELECT:
                Object.assign(formatedItem, {
                    [key]: {
                        [PARAMS_MAP_SERVER.OP]: op,
                        [PARAMS_MAP_SERVER.VALUE]: value || null,
                    },
                });
                break;
            case LOGICAL_DATA_TYPE_FILTER.TEXT:
                if (dataCase === LOGICAL_CASE_FILTER.SINGLE) {
                    Object.assign(formatedItem, {
                        [key]: {
                            [PARAMS_MAP_SERVER.OP]: op,
                            [PARAMS_MAP_SERVER.VALUE]: value || '',
                        },
                    });
                } else if (dataCase === LOGICAL_CASE_FILTER.MULTIPLE) {
                    dataFormated = [];
                    if (!isEmpty(value)) {
                        value.forEach(v => {
                            if (!isEmpty(v.data)) {
                                dataFormated.push(v.data);
                            }
                        });
                    }
                    Object.assign(formatedItem, {
                        [key]: {
                            [PARAMS_MAP_SERVER.OP]: op,
                            [PARAMS_MAP_SERVER.VALUE]: !isEmpty(dataFormated) ? dataFormated : null,
                        },
                    });
                }
                break;
            case LOGICAL_DATA_TYPE_FILTER.NUMBER:
                Object.assign(formatedItem, {
                    [key]: {
                        [PARAMS_MAP_SERVER.OP]: op,
                        [PARAMS_MAP_SERVER.VALUE]: Number(value) || null,
                    },
                });
                break;
            case LOGICAL_DATA_TYPE_FILTER.DATE:
                Object.assign(formatedItem, {
                    [key]: {
                        [PARAMS_MAP_SERVER.OP]: op,
                        [PARAMS_MAP_SERVER.VALUE]: checkDateValid(value) ? moment(new Date(value)).toISOString() : null,
                    },
                });
                break;
            case LOGICAL_DATA_TYPE_FILTER.DATE_RANGE:
                if (!isEmpty(value) && checkDateValid(value?.from) && checkDateValid(value?.to)) {
                    const { opFrom, opTo, from, to } = value;
                    const fromFormat = moment(new Date(from)).toISOString();
                    const toFormat = moment(new Date(to)).toISOString();
                    dataFormated = {
                        from: {
                            op: opFrom,
                            value: fromFormat,
                        },
                        to: {
                            op: opTo,
                            value: toFormat,
                        },
                    };
                    Object.assign(formatedItem, {
                        [key]: dataFormated,
                    });
                }
                break;
            default:
                Object.assign(formatedItem, {
                    [key]: {
                        [PARAMS_MAP_SERVER.OP]: op,
                        [PARAMS_MAP_SERVER.VALUE]: Boolean(value),
                    },
                });
                break;
        }
        !isEmpty(formatedItem) && result.push(formatedItem);
    });
    return { method: method || LOGICAL_OPERATORS_FILTER.AND, fitlers: result };
};

export default filterParser;
