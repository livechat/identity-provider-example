import useSWR from 'swr'
import Router from 'next/router'
import { Flex, Button, Table, Thead, Tbody, Tr, Th, Td, Heading, Spinner } from '@chakra-ui/react'

import { User } from 'database/types'
import { ChatWidget } from 'components/LiveChatWidget'
import { ViewContainer } from 'components/ViewContainer'

type UserData = Omit<User, 'password'>

export default function Index() {
  const { data: user, mutate } = useSWR<UserData>('/api/auth/me', {
    onError: () => Router.replace('/signin'),
  })

  const handleSignOut = async () => {
    const resp = await fetch('/api/auth/signout', { method: 'POST' })
    if (resp.ok) {
      mutate(null as any, false)
      Router.push('/signin')
    }
  }

  if (!user) {
    return (
      <ViewContainer>
        <Spinner size="xl" />
      </ViewContainer>
    )
  }

  return (
    <ViewContainer>
      <ChatWidget />
      <Flex direction="column" bg="white" rounded={8} p={8} minWidth="400px">
        <Heading mb={8}>Profile</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Lastname</Th>
              <Th>Email</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{user.name}</Td>
              <Td>{user.lastname}</Td>
              <Td>{user.email}</Td>
            </Tr>
          </Tbody>
        </Table>
        <Flex justify="center" align="center" mt={8}>
          <Button width="120px" type="button" colorScheme="orange" onClick={handleSignOut}>
            Sign out
          </Button>
        </Flex>
      </Flex>
    </ViewContainer>
  )
}
