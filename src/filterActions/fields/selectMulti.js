import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import MultiSelect from '../multiSelect';

const SelectMutilField = ({ parentName, name, index, config, props }) => {
    const { register } = useFormContext();
    const [optionState, setOptionState] = useState([]);

    const onGetValueSelect = useCallback(data => {
        setOptionState(data);
    }, []);

    return (
        <>
            <MultiSelect multiple tabIndex={-1} options={config?.data} onGetValues={onGetValueSelect} />
            <div className="d-none">
                {optionState &&
                    optionState.map((item, idx) => (
                        <span
                            key={Math.random()
                                .toString(36)
                                .substring(7)}>
                            <input
                                style={{ width: '20px' }}
                                name={`${parentName}[${index}].${name}[${idx}].data`}
                                defaultValue={item.key}
                                ref={register()}
                            />
                        </span>
                    ))}
            </div>
        </>
    );
};

SelectMutilField.propTypes = {
    parentName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    config: PropTypes.object,
    props: PropTypes.object,
};

export default memo(SelectMutilField);
