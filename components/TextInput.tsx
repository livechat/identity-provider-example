import * as React from 'react'
import { FieldHookConfig, useField } from 'formik'
import { Input } from '@chakra-ui/input'
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control'

type Props = FieldHookConfig<any> & {
  label: string
}

export function TextInput({ label, ...fieldProps }: Props) {
  const [field, meta] = useField(fieldProps)
  const isInvalid = !!meta.error && !!meta.touched

  return (
    <FormControl mt={4} isInvalid={isInvalid}>
      <FormLabel htmlFor={fieldProps.name}>{label}</FormLabel>
      <Input id={fieldProps.name} type={fieldProps.type} {...field} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  )
}
