export const ARRAY_FIELD_NAME = 'fitlers';
export const ARRAY_FIELD_METHOD = 'method';

export const COMPARISON_OPERATORS_FILTER = {
    GREATER_THAN: 'GREATER_THAN',
    LESS_THAN: 'LESS_THAN',
    GREATER_THAN_OR_EQUA: 'GREATER_THAN_OR_EQUA',
    LESS_THAN_OR_EQUA: 'LESS_THAN_OR_EQUA',
    EQUA: 'EQUA',
    NOT_EQUA: 'NOT_EQUA',
    IN: 'IN',
    NOT_IN: 'NOT_IN',
    LIKE: 'LIKE',
};

export const COMPARISON_OPERATORS_FILTER_LABEL = {
    SELECT_OPERATOR: 'Operator',
    GREATER_THAN: '>',
    LESS_THAN: '<',
    GREATER_THAN_OR_EQUA: '>=',
    LESS_THAN_OR_EQUA: '<=',
    EQUA: '=',
    NOT_EQUA: '≠',
    IN: 'In',
    NOT_IN: 'Not in',
    LIKE: 'Like',
};

export const LOGICAL_OPERATORS_FILTER = {
    AND: 'AND',
    OR: 'OR',
};

export const LOGICAL_DATA_TYPE_FILTER = {
    SELECT: 'SELECT',
    BOOLEAN: 'BOOLEAN',
    TEXT: 'TEXT',
    NUMBER: 'NUMBER',
    DATE: 'DATE',
    DATE_RANGE: 'DATE_RANGE',
};

export const LOGICAL_CASE_FILTER = {
    SINGLE: 'SINGLE',
    MULTIPLE: 'MULTIPLE',
};

export const PARAMS_MAP_SERVER = {
    ID: 'id',
    KEY: 'key',
    LABEL: 'label',
    OP: 'op',
    DATA_TYPE: 'dataType',
    DATA_CASE: 'dataCase',
    VALUE: 'value',
};

export const DATE_FORMAT_PICKER = {
    YYYYMMDD: 'yyyy/MM/dd',
    DDMMYYYY: 'dd/MM/yyyy',
    DDMMYYYY_HHss: 'dd/MM/yyyy HH:mm',
};

export const BOOLEAN_DATA_DEFAULT = [
    {
        key: true,
        value: 'Active',
    },
    {
        key: false,
        value: 'Deactive',
    },
];

export const mock = {
    page: 0,
    limit: 0,
    orderBy: 'string',
    orderType: 'ASC',
    getAll: true,
    AND: [
        {
            REF_NUMBER: {
                op: 'EQUAL',
                value: '12331',
            },
        },
        {
            RELEASE_DATE: {
                from: {
                    op: 'GREATER_THAN_OR_EQUAL',
                    value: '2020-05-26T13:37:32.721Z',
                },
                to: {
                    op: 'LESS_THAN_OR_EQUAL',
                    value: '2020-05-26T13:37:32.721Z',
                },
            },
        },
    ],
    OR: [
        {
            REF_NUMBER: {
                op: 'EQUAL',
                value: "{'$ne': null}",
            },
        },
    ],
};
