import React, { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useImmer } from 'use-immer';
import DatePicker from 'react-datepicker';
import Dropdown from 'react-bootstrap/Dropdown';
import { Controller, useFormContext } from 'react-hook-form';
import { COMPARISON_OPERATORS_FILTER, COMPARISON_OPERATORS_FILTER_LABEL } from '../../const';

const operators = Object.keys(COMPARISON_OPERATORS_FILTER)
    .map(item => ({
        key: COMPARISON_OPERATORS_FILTER[item],
        value: item,
    }))
    .filter(
        item =>
            item.key !== COMPARISON_OPERATORS_FILTER.IN &&
            item.key !== COMPARISON_OPERATORS_FILTER.NOT_IN &&
            item.key !== COMPARISON_OPERATORS_FILTER.LIKE,
    );

const DateRangeField = ({ parentName, name, index, config, props }) => {
    const { control, setValue, register } = useFormContext();
    const [startDate, setStartDate] = useState(props && props?.value?.from);
    const [endDate, setEndDate] = useState(props && props?.value?.to);
    const [labelOperatorState, setLableOperatorState] = useImmer({
        operatorFrom: COMPARISON_OPERATORS_FILTER.GREATER_THAN,
        operatorTo: COMPARISON_OPERATORS_FILTER.LESS_THAN_OR_EQUA,
    });

    const {
        options: { className, dateFormat },
    } = config;

    const handleOperatorFromChange = useCallback(
        (event, selected, index) => {
            setLableOperatorState(draft => {
                draft.operatorFrom = selected.value;
                setValue(`${parentName}[${index}].${name}.opFrom`, selected.key);
                return draft;
            });
            event.persist();
        },
        [setLableOperatorState, name, parentName, setValue],
    );
    const handleOperatorToChange = useCallback(
        (event, selected, index) => {
            setLableOperatorState(draft => {
                draft.operatorTo = selected.value;
                setValue(`${parentName}[${index}].${name}.opTo`, selected.key);
                return draft;
            });
            event.persist();
        },
        [setLableOperatorState, name, parentName, setValue],
    );

    return (
        <>
            <Dropdown className="d-flex flex-none dropdown-box operator-box sm-field">
                <Dropdown.Toggle as="div" className="d-flex flex-auto align-items-center pointer title" id="dropdown-filter-accessor">
                    <div className="truncate flex-auto text-left">
                        {COMPARISON_OPERATORS_FILTER_LABEL[labelOperatorState?.operatorFrom]}
                    </div>
                </Dropdown.Toggle>
                <input
                    className="d-none"
                    name={`${parentName}[${index}].${name}.opFrom`}
                    ref={register()}
                    defaultValue={COMPARISON_OPERATORS_FILTER.GREATER_THAN}
                />
                <Dropdown.Menu>
                    {operators.map(o => (
                        <Dropdown.Item as="span" key={o?.key} value={o?.key} onClick={event => handleOperatorFromChange(event, o, index)}>
                            <span>{COMPARISON_OPERATORS_FILTER_LABEL[o?.value]}</span>
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
            <Controller
                as={
                    <DatePicker
                        dateFormat={dateFormat}
                        selected={startDate}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className={className}
                        placeholderText="from"
                    />
                }
                onChange={([selected]) => {
                    setStartDate(selected);
                    return selected;
                }}
                name={`${parentName}[${index}].${name}.from`}
                isClearable
                control={control}
            />
            <Dropdown className="d-flex flex-none dropdown-box operator-box sm-field">
                <Dropdown.Toggle as="div" className="d-flex flex-auto align-items-center pointer title" id="dropdown-filter-accessor">
                    <div className="truncate flex-auto text-left">{COMPARISON_OPERATORS_FILTER_LABEL[labelOperatorState?.operatorTo]}</div>
                </Dropdown.Toggle>
                <input
                    className="d-none"
                    name={`${parentName}[${index}].${name}.opTo`}
                    ref={register()}
                    defaultValue={COMPARISON_OPERATORS_FILTER.LESS_THAN_OR_EQUA}
                />
                <Dropdown.Menu>
                    {operators.map(o => (
                        <Dropdown.Item as="span" key={o?.key} value={o?.key} onClick={event => handleOperatorToChange(event, o, index)}>
                            <span>{COMPARISON_OPERATORS_FILTER_LABEL[o?.value]}</span>
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
            <Controller
                as={
                    <DatePicker
                        dateFormat={dateFormat}
                        selected={endDate}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        className={className}
                        placeholderText="to"
                    />
                }
                onChange={([selected]) => {
                    setEndDate(selected);
                    return selected;
                }}
                name={`${parentName}[${index}].${name}.to`}
                isClearable
                control={control}
            />
        </>
    );
};

DateRangeField.propTypes = {
    parentName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    config: PropTypes.object,
    props: PropTypes.object,
};

export default memo(DateRangeField);
