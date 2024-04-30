'use client'
import {
    Tabs,
    TabList,
    Tab,
    Flex,
    Menu,
    MenuButton,
    Button,
    Avatar,
    MenuList,
    MenuItem,
    MenuDivider, Center, Heading, Icon, Text, Stack, HStack, IconButton
} from '@chakra-ui/react'
import {useRouter} from "next/navigation";
import {AddIcon, ChevronDownIcon} from "@chakra-ui/icons";
import AddVOD from "@/components/AddVOD";
import AddGame from "@/components/AddGame";
import { logout } from "@/app/api/auth";
import {useEffect, useState} from "react";

export default function Navbar(){
    const [user, setUser] = useState({})
    const router = useRouter()

    const handleTabChange = (idx) => {
        const paths = ["games", "team", "individual", "vods"]
        router.push(`/${paths[idx]}`)
    }

    const handleLogout = async () => {
        await logout();
        router.push("/signin");
    }

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')));
    }, []);

    return(
        <Flex minW={"%100"} alignItems={'center'} gap={12} mx={6} mt={4}>
            <Heading flex={1}>
                Placeholder
            </Heading>
            <Tabs flex={2} isFitted variant='soft-rounded' onChange={(idx) => handleTabChange(idx)}>
                <TabList>
                    <Tab>Games</Tab>
                    <Tab>Team</Tab>
                    <Tab>Individual</Tab>
                    <Tab>VODs</Tab>
                </TabList>
            </Tabs>
            <Flex flex={1} ml={"auto"} justifyContent={"flex-end"} gap={6}>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label={"Add"}
                        rounded={'full'}
                        cursor={'pointer'}
                        icon={<AddIcon/>}
                        isRound
                        variant={"solid"}
                    />
                    <MenuList>
                        <MenuItem><AddVOD/></MenuItem>
                        <MenuItem><AddGame/></MenuItem>
                    </MenuList>
                </Menu>
                <Menu>
                    <HStack gap={6}>
                        <Avatar
                            size={'md'}
                            src={
                                'https://i.kym-cdn.com/photos/images/newsfeed/001/553/696/a42.jpg'
                            }
                        />
                        <Heading size={'sm'}>
                            {user.username}
                        </Heading>
                    <MenuButton
                        as={IconButton}
                        aria-label={"Profile"}
                        rounded={'full'}
                        variant={'link'}
                        cursor={'pointer'}
                        minW={0}
                        icon={<ChevronDownIcon/>}
                    />
                    </HStack>
                    <MenuList>
                        <MenuItem>Profile</MenuItem>
                        <MenuItem>Settings</MenuItem>
                        <MenuDivider />
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </Flex>
    )
}
