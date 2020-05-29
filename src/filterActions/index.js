import React, { memo, useCallback } from 'react';
import { isEmpty } from 'lodash';
import { useImmer } from 'use-immer';
import PropTypes from 'prop-types';
import { useForm, FormContext } from 'react-hook-form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import RenderFormItemValue from './formItemValue';
import RenderFormItemOperators from './formItemOperators';
import filterParser from './parser';
import {
    ARRAY_FIELD_NAME,
    ARRAY_FIELD_METHOD,
    PARAMS_MAP_SERVER,
    COMPARISON_OPERATORS_FILTER,
    LOGICAL_OPERATORS_FILTER,
    LOGICAL_CASE_FILTER,
} from '../const';

const logicals = Object.keys(LOGICAL_OPERATORS_FILTER).map(item => ({
    key: LOGICAL_OPERATORS_FILTER[item],
    value: item,
}));

const FilterActions = ({ options: FILTER_CONFIG, onGetValue }) => {
    const defaultFilterItem = {
        key: FILTER_CONFIG[0].accessor,
        label: FILTER_CONFIG[0].label,
        op: COMPARISON_OPERATORS_FILTER.EQUA,
        value: FILTER_CONFIG[0].defaultValue,
    };

    const methods = useForm({});
    const { handleSubmit, watch, setValue } = methods;
    const [fieldState, setFieldState] = useImmer([]);
    const [labelFieldState, setLabelFieldState] = useImmer({
        logical: 'Where',
        accessor: 'Accessor',
        operator: 'Operator',
    });
    const onSubmit = data => {
        const formated = filterParser(data);
        typeof onGetValue === 'function' && onGetValue(formated);
    };

    const addFilterItem = () => {
        setFieldState(draft => {
            draft.push({
                id: Math.random()
                    .toString(36)
                    .substring(7),
                ...defaultFilterItem,
            });
            return draft;
        });
    };

    const removeFilterItem = (event, index) => {
        event.preventDefault();
        setFieldState(draft => {
            draft.splice(index, 1);
            return draft;
        });
        setValue(ARRAY_FIELD_NAME, fieldState);
    };

    const handleLogicalChange = useCallback(
        (event, selected) => {
            setLabelFieldState(draft => {
                draft.logical = selected.value;
                methods.setValue(ARRAY_FIELD_METHOD, selected.key);
                return draft;
            });
            event.persist();
        },
        [methods, setLabelFieldState],
    );

    const handleAccessorChange = useCallback(
        (event, selected, index) => {
            const hasIndex = FILTER_CONFIG.findIndex(item => item.accessor === selected.accessor);
            if (hasIndex !== -1) {
                const configSeleted = FILTER_CONFIG[hasIndex];
                setFieldState(draft => {
                    const itemSelected = draft[index];
                    itemSelected[PARAMS_MAP_SERVER.KEY] = configSeleted.accessor;
                    itemSelected[PARAMS_MAP_SERVER.LABEL] = configSeleted.label;
                    itemSelected[PARAMS_MAP_SERVER.OP] =
                        configSeleted.case === LOGICAL_CASE_FILTER.SINGLE
                            ? COMPARISON_OPERATORS_FILTER.EQUA
                            : COMPARISON_OPERATORS_FILTER.IN;
                    itemSelected[PARAMS_MAP_SERVER.DATA_TYPE] = configSeleted.type;
                    itemSelected[PARAMS_MAP_SERVER.DATA_CASE] = configSeleted.case;
                    itemSelected[PARAMS_MAP_SERVER.VALUE] = null;
                    methods.setValue(
                        `${ARRAY_FIELD_NAME}[${index}].${PARAMS_MAP_SERVER.ID}`,
                        Math.random()
                            .toString(36)
                            .substring(7),
                    );
                    methods.setValue(
                        `${ARRAY_FIELD_NAME}[${index}].${PARAMS_MAP_SERVER.OP}`,
                        configSeleted.case === LOGICAL_CASE_FILTER.SINGLE
                            ? COMPARISON_OPERATORS_FILTER.EQUA
                            : COMPARISON_OPERATORS_FILTER.IN,
                    );
                    methods.setValue(`${ARRAY_FIELD_NAME}[${index}].${PARAMS_MAP_SERVER.KEY}`, configSeleted.accessor);
                    methods.setValue(`${ARRAY_FIELD_NAME}[${index}].${PARAMS_MAP_SERVER.DATA_TYPE}`, configSeleted.type);
                    methods.setValue(`${ARRAY_FIELD_NAME}[${index}].${PARAMS_MAP_SERVER.DATA_CASE}`, configSeleted.case);
                    if (configSeleted.case === LOGICAL_CASE_FILTER.MULTIPLE) {
                        methods.setValue(`${ARRAY_FIELD_NAME}[${index}].${PARAMS_MAP_SERVER.VALUE}`, null);
                    }
                    return draft;
                });
            }
            event.persist();
        },
        [FILTER_CONFIG, methods, setFieldState],
    );

    return (
        <>
            <div className="filter-actions">
                <FormContext {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="inner-filter-actions">
                            {isEmpty(fieldState) && <div className="text-black-50">No filters applied to this view</div>}
                            <ul className="p-0 m-0">
                                {fieldState.map((item, index) => {
                                    return (
                                        <li key={index} className="d-flex align-items-center">
                                            <Col xs={5} className="p-0 d-flex align-items-center">
                                                <div className="d-flex flex-none align-items-center mr-1">
                                                    <div
                                                        className="pointer"
                                                        tabIndex="0"
                                                        role="button"
                                                        title="Remove filter"
                                                        onClick={event => removeFilterItem(event, index)}>
                                                        <i className="uil-times" />
                                                    </div>
                                                </div>
                                                <Dropdown className="d-flex flex-none mr-1 dropdown-box logical-box">
                                                    <Dropdown.Toggle
                                                        as="button"
                                                        disabled={index === 0 || index + 1 < fieldState.length}
                                                        className="d-flex flex-auto align-items-center pointer title"
                                                        id="dropdown-filter-logical">
                                                        <div className="truncate flex-auto text-left">
                                                            {index === 0 ? 'Where' : labelFieldState?.logical}
                                                        </div>
                                                    </Dropdown.Toggle>
                                                    <input className="d-none" name="method" ref={methods.register()} />
                                                    <Dropdown.Menu>
                                                        {logicals.map(l => (
                                                            <Dropdown.Item
                                                                as="span"
                                                                key={l?.key}
                                                                value={l?.key}
                                                                onClick={event => handleLogicalChange(event, l)}>
                                                                <span> {l?.value}</span>
                                                            </Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                <Dropdown className="d-flex flex-auto mr-1 dropdown-box accessor-box">
                                                    <Dropdown.Toggle
                                                        as="div"
                                                        className="d-flex flex-auto align-items-center pointer title"
                                                        id="dropdown-filter-accessor">
                                                        <div className="truncate flex-auto text-left">
                                                            {(watch(`${ARRAY_FIELD_NAME}[${index}].${PARAMS_MAP_SERVER.KEY}`) &&
                                                                item?.label) ||
                                                                labelFieldState?.accessor}
                                                        </div>
                                                    </Dropdown.Toggle>
                                                    <input
                                                        className="d-none"
                                                        name={`${ARRAY_FIELD_NAME}[${index}].${PARAMS_MAP_SERVER.ID}`}
                                                        ref={methods.register()}
                                                    />
                                                    <input
                                                        className="d-none"
                                                        name={`${ARRAY_FIELD_NAME}[${index}].${PARAMS_MAP_SERVER.KEY}`}
                                                        ref={methods.register()}
                                                    />
                                                    <input
                                                        className="d-none"
                                                        name={`${ARRAY_FIELD_NAME}[${index}].${PARAMS_MAP_SERVER.DATA_TYPE}`}
                                                        ref={methods.register()}
                                                    />
                                                    <input
                                                        className="d-none"
                                                        name={`${ARRAY_FIELD_NAME}[${index}].${PARAMS_MAP_SERVER.DATA_CASE}`}
                                                        ref={methods.register()}
                                                    />
                                                    <Dropdown.Menu>
                                                        {FILTER_CONFIG.map(c => (
                                                            <Dropdown.Item
                                                                as="span"
                                                                key={c?.accessor}
                                                                value={c?.accessor}
                                                                onClick={event => handleAccessorChange(event, c, index)}>
                                                                <span> {c?.label}</span>
                                                            </Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Col>
                                            <Col xs={7} className="p-0 d-flex">
                                                <div className="d-flex flex-none">
                                                    <RenderFormItemOperators index={index} item={item} />
                                                </div>
                                                <div className="d-flex flex-auto">
                                                    <RenderFormItemValue index={index} item={item} />
                                                </div>
                                            </Col>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="d-flex align-items-center justify-content-between filter-buttons">
                            <span
                                className="pointer font-weight-bold"
                                tabIndex="0"
                                title="Add filter"
                                role="button"
                                onClick={addFilterItem}>
                                <i className="uil-plus mr-1" />
                                Add filter
                            </span>
                            {fieldState.length > 0 && (
                                <Button variant="primary btn-sm" type="submit">
                                    Filter
                                </Button>
                            )}
                        </div>
                    </form>
                </FormContext>
            </div>
        </>
    );
};

FilterActions.propTypes = { options: PropTypes.array.isRequired, onGetValue: PropTypes.func };

export default memo(FilterActions);
