import * as yup from 'yup'
import Router from 'next/router'
import Link from 'next/link'
import { Formik, Form } from 'formik'
import { Heading, Flex, Link as UILink, Button } from '@chakra-ui/react'

import { TextInput } from 'components/TextInput'
import { ViewContainer } from 'components/ViewContainer'

type FormValues = {
  email: string
  password: string
  name: string
  lastname: string
}

const initialValues: FormValues = {
  email: '',
  password: '',
  name: '',
  lastname: '',
}

const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  name: yup.string().required(),
  lastname: yup.string().required(),
})

const handleSubmit = async (values: FormValues) => {
  const resp = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })

  if (resp.ok) {
    await Router.push('/signin')
  }
}

export default function SignUp() {
  return (
    <ViewContainer>
      <Flex direction="column" rounded={8} p={8} bg="white" minWidth="400px">
        <Heading mb={8}>Sign up</Heading>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, isValid }) => (
            <Form>
              <TextInput name="email" type="email" label="Email:" />
              <TextInput name="password" type="password" label="Password:" />
              <TextInput name="name" type="text" label="Name:" />
              <TextInput name="lastname" type="text" label="Lastname:" />
              <Button
                mt={4}
                type="submit"
                width="100%"
                colorScheme="orange"
                isLoading={isSubmitting}
                disabled={isSubmitting || !isValid}
              >
                Sign up
              </Button>
            </Form>
          )}
        </Formik>
        <Link passHref href="/signin">
          <UILink mt={2}>Sign in</UILink>
        </Link>
      </Flex>
    </ViewContainer>
  )
}
