'use client'
import {Center, Flex, Heading, HStack, Select, Stack} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import VodTable from "@/components/VodTable";
import {vods} from "@/app/lib/vods-placeholder";
import {useState} from "react";

export default function Page(){
    const [data, setData] = useState(vods)
    return(
        <Center my={8} width={"inherit"}>
            <Flex flexDirection={"column"} gap={12}>
                <Flex justifyContent={"space-between"}>
                    <Heading>VODs List</Heading>
                    <HStack gap={8}>
                        <Select rightIcon={<ChevronDownIcon/>} placeholder={"Sort by"} maxW={"fit-content"}>
                            <option value={"date-desc"}>Date - Desc</option>
                            <option value={"date-asc"}>Date - Asc</option>
                            <option value={"against-desc"}>Against - Desc</option>
                            <option value={"against-asc"}>Against - Asc</option>
                        </Select>
                    </HStack>
                </Flex>
                <VodTable vods={data}/>
                <Stack direction={"column-reverse"}>
                    <Stack>1-10 of 50</Stack>
                </Stack>
            </Flex>
        </Center>
    )
}