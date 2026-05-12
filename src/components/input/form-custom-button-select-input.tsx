import { useField } from 'formik'
import React from 'react'
import { CustomButtonSelectInput, CustomButtonSelectInputProps } from './base'

export const FormCustomButtonSelectInput = <T,>(props: React.PropsWithChildren<CustomButtonSelectInputProps<T>>) => {
    const [field, meta, helpers] = useField(props.name)
    const errors = meta.touched ? (meta.error as string[] | undefined) : undefined

    return <CustomButtonSelectInput {...props} {...field} onChange={helpers.setValue} errors={errors} />
}
