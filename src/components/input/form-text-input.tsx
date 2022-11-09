import { useField } from 'formik'
import React from 'react'
import { TextInput, TextInputProps } from './base'

export const FormTextInput: React.FC<TextInputProps> = (props) => {
    const [field, meta] = useField(props.name)
    const errors = meta.touched ? (meta.error as string[] | undefined) : undefined

    return <TextInput {...props} {...field} errors={errors} />
}
