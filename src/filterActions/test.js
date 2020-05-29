const mock = {
    method: 'AND',
    fitlers: [
        {
            key: 'available',
            dataType: 'BOOLEAN',
            dataCase: 'SINGLE',
            op: 'EQUA',
            value: 'true',
        },
        {
            key: 'date',
            dataType: 'DATE',
            dataCase: 'SINGLE',
            op: 'GREATER_THAN',
            value: '2020-05-26T17:00:00.000Z',
        },
        {
            key: 'dateRange',
            dataType: 'DATE_RANGE',
            dataCase: 'SINGLE',
            op: 'EQUA',
            value: { opFrom: 'GREATER_THAN', opTo: 'LESS_THAN', from: '2020-05-26T17:00:00.000Z', to: '2020-06-05T17:00:00.000Z' },
            // value: { opFrom: 'LESS_THAN', opTo: '', from: '2020-05-26T17:00:00.000Z' },
        },
        {
            key: 'quanlity',
            dataType: 'NUMBER',
            dataCase: 'SINGLE',
            op: 'GREATER_THAN_OR_EQUA',
            value: '10',
        },
        {
            key: 'name',
            dataType: 'TEXT',
            dataCase: 'SINGLE',
            op: 'EQUA',
            value: 'Demo',
        },
        { id: 'jwoc3', key: 'variant', dataType: 'TEXT', dataCase: 'MULTIPLE', op: 'EQUA', value: [{ data: 'S' }, { data: 'K' }] },
    ],
};

export default mock;
