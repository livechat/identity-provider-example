import * as yup from 'yup'
import Router from 'next/router'
import Link from 'next/link'
import { Formik, Form } from 'formik'
import { Heading, Flex, Button, Link as UILink } from '@chakra-ui/react'

import { TextInput } from 'components/TextInput'
import { ViewContainer } from 'components/ViewContainer'

type FormValues = {
  email: string
  password: string
}

const initialValues: FormValues = {
  email: '',
  password: '',
}

const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
})

const handleSubmit = async (values: FormValues) => {
  const resp = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })

  if (resp.ok) {
    await Router.push('/')
  }
}

export default function SigInp() {
  return (
    <ViewContainer>
      <Flex direction="column" rounded={8} p={8} bg="white" minWidth="400px">
        <Heading mb={8}>Sign in</Heading>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, isValid }) => (
            <Form>
              <TextInput name="email" type="email" label="Email:" />
              <TextInput name="password" type="password" label="Password:" />
              <Button
                mt={4}
                type="submit"
                width="100%"
                colorScheme="orange"
                isLoading={isSubmitting}
                disabled={isSubmitting || !isValid}
              >
                Sign in
              </Button>
            </Form>
          )}
        </Formik>
        <Link href="/signup">
          <UILink mt={2}>Sign up</UILink>
        </Link>
      </Flex>
    </ViewContainer>
  )
}
