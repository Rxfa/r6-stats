import {
  Box,
  chakra,
  Container,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react'

import { FaDiscord, FaGithub, FaInstagram } from 'react-icons/fa'

const SocialButton = ({children, label, href,}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      width={8}
      height={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  )
}

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.100', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}>
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}>
        <Text> © 2023 Rxfa. All rights reserved</Text>
        <Spacer/>
        <Stack direction={'row'} spacing={6}>
          <SocialButton label={'Github'} href={'#'}>
            <FaGithub />
          </SocialButton>
          <SocialButton label={'Discord'} href={'#'}>
            <FaDiscord />
          </SocialButton>
          <SocialButton label={'Instagram'} href={'#'}>
            <FaInstagram />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  )
}