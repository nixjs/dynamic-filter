import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { TextField, SelectField, SelectMutilField, DateField, DateRangeField } from './fields';
import FILTER_CONFIG from '../config';
import { ARRAY_FIELD_NAME, LOGICAL_DATA_TYPE_FILTER, LOGICAL_CASE_FILTER } from '../const';

const RenderFormItemValue = memo(({ index, item }) => {
    const hasIndex = FILTER_CONFIG.findIndex(c => c.accessor === item.key);
    if (hasIndex === -1) {
        return <>Empty</>;
    }
    const filterConfig = FILTER_CONFIG[hasIndex];
    switch (filterConfig.type) {
        case LOGICAL_DATA_TYPE_FILTER.BOOLEAN:
            return <SelectField parentName={ARRAY_FIELD_NAME} name="value" index={index} props={item} config={filterConfig} />;
        case LOGICAL_DATA_TYPE_FILTER.SELECT:
            return <SelectField parentName={ARRAY_FIELD_NAME} name="value" index={index} props={item} config={filterConfig} />;
        case LOGICAL_DATA_TYPE_FILTER.NUMBER:
        case LOGICAL_DATA_TYPE_FILTER.TEXT:
            if (filterConfig.case === LOGICAL_CASE_FILTER.MULTIPLE) {
                return <SelectMutilField parentName={ARRAY_FIELD_NAME} name="value" index={index} props={item} config={filterConfig} />;
            }
            return <TextField parentName={ARRAY_FIELD_NAME} name="value" index={index} props={item} config={filterConfig} />;
        case LOGICAL_DATA_TYPE_FILTER.DATE:
            return <DateField parentName={ARRAY_FIELD_NAME} name="value" index={index} props={item} config={filterConfig} />;
        case LOGICAL_DATA_TYPE_FILTER.DATE_RANGE:
            return <DateRangeField parentName={ARRAY_FIELD_NAME} name="value" index={index} props={item} config={filterConfig} />;
        default:
            return <TextField parentName={ARRAY_FIELD_NAME} name="value" index={index} props={item} config={filterConfig} />;
    }
});

RenderFormItemValue.propTypes = { index: PropTypes.number, item: PropTypes.object };

export default RenderFormItemValue;
