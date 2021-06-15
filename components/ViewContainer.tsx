import { ReactNode } from 'react'
import { Flex } from '@chakra-ui/layout'

type Props = {
  children: ReactNode
}

export function ViewContainer({ children }: Props) {
  return (
    <Flex justify="center" align="center" height="100vh" width="100vw" bg="gray.100">
      {children}
    </Flex>
  )
}
