import { useField } from 'formik'
import React from 'react'
import { TextAreaInput, TextAreaInputProps } from './base'

export const FormTextAreaInput: React.FC<TextAreaInputProps> = (props) => {
    const [field, meta] = useField(props.name)
    const errors = meta.touched ? (meta.error as string[] | undefined) : undefined

    return <TextAreaInput {...props} {...field} errors={errors} />
}
