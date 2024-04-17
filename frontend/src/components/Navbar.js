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

export default function Navbar(){
    const router = useRouter()

    const handleTabChange = (idx) => {
        const paths = ["games", "team", "individual", "vods"]
        router.push(`${paths[idx]}`)
    }

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
                                'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                            }
                        />
                        <Heading size={'sm'}>
                            Dummy
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
                        <MenuItem>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </Flex>
    )
}
