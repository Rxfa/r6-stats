'use client'

import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  useBoolean,
  Link,
} from '@chakra-ui/react'
import { useNavigate } from "react-router";
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { FaHome } from 'react-icons/fa'
import { getUser, logout, isLogged } from '../utils/utils';
import {useEffect} from "react";

const NavLink = (props) => {
  const { children } = props

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'#'}>
      {children}
    </Box>
  )
}

function Navbar(props) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const user = getUser();
  const isAuthenticated = !!user;

  useEffect(() => {
    if(!isAuthenticated){
        navigate("/");
    }
  }, []);


  const handleHome = () => {
    navigate("/dashboard");
  }

  const handleProfile = () => {
    navigate("/profile");
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  return (
    <>
      <Box bg={useColorModeValue('gray.200', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <Button variant={"outline"} leftIcon={<FaHome/>} onClick={handleHome}>
                Home
              </Button>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
              {
                isAuthenticated &&
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={'full'}
                      variant={'link'}
                      cursor={'pointer'}
                      minW={0}>
                      <Avatar
                        size={'sm'}
                        src={'https://en.meming.world/images/en/thumb/1/10/Yellow_Glasses_Guy.jpg/300px-Yellow_Glasses_Guy.jpg'}
                      />
                    </MenuButton>
                    <MenuList alignItems={'center'}>
                      <br />
                      <Center>
                        <Avatar
                          size={'2xl'}
                          src={'https://en.meming.world/images/en/thumb/1/10/Yellow_Glasses_Guy.jpg/300px-Yellow_Glasses_Guy.jpg'}
                        />
                      </Center>
                      <br />
                      <Center>
                        <p>{user.username}</p>
                      </Center>
                      <br />
                      <MenuDivider />
                      <MenuItem onClick={handleProfile}>Account Settings</MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </MenuList>
                  </Menu>
              }
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}

export default Navbar;