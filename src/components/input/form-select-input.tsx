import { useField } from 'formik'
import React from 'react'
import { SelectInput, SelectInputProps } from './base'

export const FormSelectInput = <T,>(props: React.PropsWithChildren<SelectInputProps<T>>) => {
    const [field, meta, helpers] = useField(props.name)
    const errors = meta.touched ? (meta.error as string[] | undefined) : undefined

    return <SelectInput {...props} {...field} onChange={helpers.setValue} errors={errors} />
}
