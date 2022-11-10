import { useField } from 'formik'
import { omit } from 'lodash'
import React from 'react'
import { NumericalInput, NumericalInputProps } from './base'

export const FormNumericalInput: React.FC<NumericalInputProps> = (props) => {
    const [field, meta, helpers] = useField(props.name)
    const errors = meta.touched ? (meta.error as string[] | undefined) : undefined

    return <NumericalInput {...props} {...omit(field, 'onChange')} onChange={helpers.setValue} errors={errors} />
}
