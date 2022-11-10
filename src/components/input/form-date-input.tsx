import { useField } from 'formik'
import React from 'react'
import { DateInput, DateInputProps } from './base'

export const FormDateInput: React.FC<DateInputProps> = (props) => {
    const [field, meta, helpers] = useField<Date>(props.name)
    const errors = meta.touched ? (meta.error as string[] | undefined) : undefined

    return <DateInput {...props} value={field.value} onChange={helpers.setValue} errors={errors} />
}
