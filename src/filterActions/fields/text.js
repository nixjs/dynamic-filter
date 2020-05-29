import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
const TextField = ({ parentName, name, index, config, props }) => {
    const { control } = useFormContext();
    return (
        <>
            <Controller
                as={<input {...config?.options} />}
                name={`${parentName}[${index}].${name}`}
                control={control}
                defaultValue={config?.defaultValue} // make sure to set up defaultValue
            />
        </>
    );
};

TextField.propTypes = {
    parentName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    config: PropTypes.object,
    props: PropTypes.object,
};

export default memo(TextField);
