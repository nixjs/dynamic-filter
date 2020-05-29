import { LOGICAL_CASE_FILTER, LOGICAL_DATA_TYPE_FILTER, DATE_FORMAT_PICKER } from './const';

const FILTER_CONFIG = [
    {
        accessor: 'available',
        label: 'Status',
        options: {
            className: 'form-control form-control-sm',
            placeholder: 'Select status',
        },
        type: LOGICAL_DATA_TYPE_FILTER.BOOLEAN,
        case: LOGICAL_CASE_FILTER.SINGLE,
        defaultValue: null,
    },
    {
        accessor: 'type',
        label: 'Type',
        options: {
            className: 'form-control form-control-sm',
            placeholder: 'Select status',
        },
        type: LOGICAL_DATA_TYPE_FILTER.SELECT,
        case: LOGICAL_CASE_FILTER.SINGLE,
        data: [
            { key: 'PUBLIC', value: 'Public' },
            { key: 'PRIVATE', value: 'Private' },
        ],
    },
    {
        accessor: 'date',
        label: 'Date',
        options: {
            className: 'form-control form-control-sm',
            placeholder: 'Select date',
            timeInputLabel: 'Time:',
            dateFormat: DATE_FORMAT_PICKER.DDMMYYYY_HHss,
        },
        type: LOGICAL_DATA_TYPE_FILTER.DATE,
        case: LOGICAL_CASE_FILTER.SINGLE,
        defaultValue: null,
        data: null,
    },
    {
        accessor: 'dateRange',
        label: 'Date Range',
        options: {
            className: 'form-control form-control-sm',
            placeholder: 'Select date',
            dateFormat: DATE_FORMAT_PICKER.DDMMYYYY,
        },
        type: LOGICAL_DATA_TYPE_FILTER.DATE_RANGE,
        case: LOGICAL_CASE_FILTER.SINGLE,
        defaultValue: null,
        data: null,
    },
    {
        accessor: 'quanlity',
        label: 'Quality',
        options: {
            className: 'form-control form-control-sm',
            placeholder: 'Input the quanlity',
            type: 'number',
            min: 0,
        },
        type: LOGICAL_DATA_TYPE_FILTER.NUMBER,
        case: LOGICAL_CASE_FILTER.SINGLE,
        defaultValue: 0,
    },
    {
        accessor: 'name',
        label: 'Name',
        options: {
            className: 'form-control form-control-sm',
            placeholder: 'Input the name',
            type: 'text',
        },
        type: LOGICAL_DATA_TYPE_FILTER.TEXT,
        case: LOGICAL_CASE_FILTER.SINGLE,
        defaultValue: '',
    },
    {
        accessor: 'variant',
        label: 'Variant',
        options: {
            className: 'form-control form-control-sm',
            placeholder: 'Select variant',
        },
        type: LOGICAL_DATA_TYPE_FILTER.TEXT,
        case: LOGICAL_CASE_FILTER.MULTIPLE,
        defaultValue: '',
        data: [
            {
                key: 'S',
                value: 'Size S',
            },
            {
                key: 'K',
                value: 'Size K',
            },
            {
                key: 'M',
                value: 'Size M',
            },
        ],
    },
];

export default FILTER_CONFIG;
