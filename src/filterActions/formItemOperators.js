import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useImmer } from 'use-immer';
import { useFormContext } from 'react-hook-form';
import Dropdown from 'react-bootstrap/Dropdown';
import FILTER_CONFIG from '../config';
import {
    ARRAY_FIELD_NAME,
    COMPARISON_OPERATORS_FILTER,
    LOGICAL_CASE_FILTER,
    LOGICAL_DATA_TYPE_FILTER,
    COMPARISON_OPERATORS_FILTER_LABEL,
} from '../const';

const operators = Object.keys(COMPARISON_OPERATORS_FILTER).map(item => ({
    key: COMPARISON_OPERATORS_FILTER[item],
    value: item,
}));
const operatorMultiDefaults = [COMPARISON_OPERATORS_FILTER.IN, COMPARISON_OPERATORS_FILTER.NOT_IN];
const operatorStates = filterConfig => {
    let operatorState = operators;
    switch (filterConfig.type) {
        case LOGICAL_DATA_TYPE_FILTER.BOOLEAN:
            if (filterConfig.case === LOGICAL_CASE_FILTER.SINGLE) {
                operatorState = operators.filter(
                    item => item.key === COMPARISON_OPERATORS_FILTER.EQUA || item.key === COMPARISON_OPERATORS_FILTER.NOT_EQUA,
                );
            } else {
                operatorState = operators.filter(item => operatorMultiDefaults.includes(item.key));
            }
            break;
        case LOGICAL_DATA_TYPE_FILTER.SELECT:
            operatorState = operators.filter(
                item => item.key === COMPARISON_OPERATORS_FILTER.EQUA || item.key === COMPARISON_OPERATORS_FILTER.NOT_EQUA,
            );
            break;
        case LOGICAL_DATA_TYPE_FILTER.NUMBER:
            if (filterConfig.case === LOGICAL_CASE_FILTER.SINGLE) {
                operatorState = operators.filter(
                    item =>
                        item.key !== COMPARISON_OPERATORS_FILTER.IN &&
                        item.key !== COMPARISON_OPERATORS_FILTER.NOT_IN &&
                        item.key !== COMPARISON_OPERATORS_FILTER.LIKE,
                );
            } else {
                operatorState = operators.filter(item => operatorMultiDefaults.includes(item.key));
            }
            break;
        case LOGICAL_DATA_TYPE_FILTER.TEXT:
            if (filterConfig.case === LOGICAL_CASE_FILTER.SINGLE) {
                operatorState = operators.filter(
                    item =>
                        item.key === COMPARISON_OPERATORS_FILTER.EQUA ||
                        item.key === COMPARISON_OPERATORS_FILTER.NOT_EQUA ||
                        item.key === COMPARISON_OPERATORS_FILTER.LIKE,
                );
            } else {
                operatorState = operators.filter(
                    item => operatorMultiDefaults.includes(item.key) || item.key === COMPARISON_OPERATORS_FILTER.LIKE,
                );
            }
            break;
        case LOGICAL_DATA_TYPE_FILTER.DATE:
            if (filterConfig.case === LOGICAL_CASE_FILTER.SINGLE) {
                operatorState = operators.filter(
                    item =>
                        item.key !== COMPARISON_OPERATORS_FILTER.IN &&
                        item.key !== COMPARISON_OPERATORS_FILTER.NOT_IN &&
                        item.key !== COMPARISON_OPERATORS_FILTER.LIKE,
                );
            } else {
                operatorState = operators.filter(item => operatorMultiDefaults.includes(item.key));
            }
            break;
        case LOGICAL_DATA_TYPE_FILTER.DATE_RANGE:
            if (filterConfig.case === LOGICAL_CASE_FILTER.SINGLE) {
                operatorState = operators.filter(
                    item => item.key === COMPARISON_OPERATORS_FILTER.EQUA || item.key === COMPARISON_OPERATORS_FILTER.NOT_EQUA,
                );
            }
            break;
        default:
            operatorState = operators;
            break;
    }
    return operatorState;
};

const RenderFormItemOperators = memo(({ index, item }) => {
    const { setValue, register } = useFormContext();
    const [labelOperatorState, setLableOperatorState] = useImmer({
        operator: null,
    });
    const hasIndex = FILTER_CONFIG.findIndex(c => c.accessor === item.key);
    if (hasIndex === -1) {
        return <>Empty</>;
    }
    const filterConfig = FILTER_CONFIG[hasIndex];
    const operatorState = operatorStates(filterConfig);

    const handleOperatorChange = useCallback(
        (event, selected, index) => {
            setLableOperatorState(draft => {
                draft.operator = selected.value;
                setValue(`${ARRAY_FIELD_NAME}[${index}].op`, selected.key);
                return draft;
            });
            event.persist();
        },
        [setLableOperatorState, setValue],
    );

    return (
        <div className="mr-1">
            <Dropdown className="d-flex flex-auto mr-1 dropdown-box operator-box">
                <Dropdown.Toggle as="div" className="d-flex flex-auto align-items-center pointer title" id="dropdown-filter-accessor">
                    <div className="truncate flex-auto text-left">
                        {COMPARISON_OPERATORS_FILTER_LABEL[!isEmpty(labelOperatorState?.operator) ? labelOperatorState?.operator : item.op]}
                    </div>
                </Dropdown.Toggle>
                <input
                    className="d-none"
                    name={`${ARRAY_FIELD_NAME}[${index}].op`}
                    ref={register()}
                    defaultValue={COMPARISON_OPERATORS_FILTER.EQUA}
                />
                <Dropdown.Menu>
                    {operatorState.map(o => (
                        <Dropdown.Item as="span" key={o?.key} value={o?.key} onClick={event => handleOperatorChange(event, o, index)}>
                            <span>{COMPARISON_OPERATORS_FILTER_LABEL[o?.value]}</span>
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
});

RenderFormItemOperators.propTypes = { index: PropTypes.number, item: PropTypes.object };

export default RenderFormItemOperators;
