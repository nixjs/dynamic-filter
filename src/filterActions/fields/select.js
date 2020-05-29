import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useImmer } from 'use-immer';
import { useFormContext } from 'react-hook-form';
import { LOGICAL_DATA_TYPE_FILTER, BOOLEAN_DATA_DEFAULT } from '../../const';

const SelectField = ({ parentName, name, index, config, props }) => {
    const { register } = useFormContext();
    const [optionState, setOptionState] = useImmer([]);

    useEffect(() => {
        setOptionState(draft => {
            config?.type === LOGICAL_DATA_TYPE_FILTER.BOOLEAN ? (draft = BOOLEAN_DATA_DEFAULT) : (draft = config?.data);
            return draft;
        });
    }, [config, setOptionState]);

    return (
        <>
            <select name={`${parentName}[${index}].${name}`} ref={register()} {...config?.options}>
                {optionState.map(item => (
                    <option key={item?.key} value={item?.key}>
                        {item?.value}
                    </option>
                ))}
            </select>
        </>
    );
};

SelectField.propTypes = {
    parentName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    config: PropTypes.object,
    props: PropTypes.object,
};

export default memo(SelectField);
