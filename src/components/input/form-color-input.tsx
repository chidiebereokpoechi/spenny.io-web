import { useField } from 'formik'
import React from 'react'
import { ColorInput, ColorInputProps } from './base'

export const FormColorInput: React.FC<ColorInputProps> = (props) => {
    const [field, meta, helpers] = useField<string>(props.name)
    const errors = meta.touched ? (meta.error as string[] | undefined) : undefined

    return <ColorInput {...props} value={field.value} onChange={helpers.setValue} errors={errors} />
}
