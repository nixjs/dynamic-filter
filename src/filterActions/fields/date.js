import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { Controller, useFormContext } from 'react-hook-form';

const DateField = ({ parentName, name, index, config, props }) => {
    const { control } = useFormContext();
    const {
        options: { className, placeholder, timeInputLabel, dateFormat },
    } = config;
    const [startDate, setStartDate] = useState(null);

    return (
        <>
            <Controller
                as={
                    <DatePicker
                        selected={startDate}
                        dateFormat={dateFormat}
                        timeInputLabel={timeInputLabel}
                        showTimeInput
                        autoComplete="off"
                        showMonthDropdown
                        className={className}
                        placeholderText={placeholder}
                    />
                }
                onChange={([selected]) => {
                    setStartDate(selected);
                    return selected;
                }}
                name={`${parentName}[${index}].${name}`}
                isClearable
                control={control}
            />
        </>
    );
};

DateField.propTypes = {
    parentName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    config: PropTypes.object,
    props: PropTypes.object,
};

export default memo(DateField);
