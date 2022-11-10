import { useField } from 'formik'
import React from 'react'
import { CategoriesSelectInput, CategoriesSelectInputProps } from './base'

export const FormCategoriesSelectInput: React.FC<CategoriesSelectInputProps> = (props) => {
    const [field, meta, helpers] = useField(props.name)
    const errors = meta.touched ? (meta.error as string[] | undefined) : undefined

    return <CategoriesSelectInput {...props} {...field} onChange={helpers.setValue} errors={errors} />
}
