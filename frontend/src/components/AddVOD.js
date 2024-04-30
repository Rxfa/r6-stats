import {
    Button, FormControl, FormHelperText, FormLabel, IconButton, Input, InputGroup, InputLeftAddon, InputRightAddon,
    Modal, ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, Stack, Text,
    useDisclosure
} from "@chakra-ui/react";
import {AddIcon, CloseIcon} from "@chakra-ui/icons";
import React, { useState } from 'react';
import { addVod } from "@/app/api/vods";

export default function AddVOD(){
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [against, setAgainst] = useState('')
    const [notes, setNotes] = useState('')
    const [url, setUrl] = useState('')

    const handleClick = event => {
        event.preventDefault()
        const form = {
            "against": against, 
            "notes": notes, 
            "url": url
        }
        addVod(form)
        .then(() => {
            onClose()
        })
    }

    return(
        <>
            <Button onClick={onOpen} w={"100%"}>Add VOD</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add VOD</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleClick}>
                        <ModalBody>
                            <Stack gap={4}>
                                <FormControl isRequired>
                                    <FormLabel>Vs</FormLabel>
                                    <Input type='text' onChange={e => setAgainst(e.currentTarget.value)}/>
                                    <FormHelperText>The team you played against</FormHelperText>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Notes</FormLabel>
                                    <Input type='text' onChange={e => setNotes(e.currentTarget.value)}/>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>VOD URL</FormLabel>
                                    <InputGroup size='sm'>
                                        <InputLeftAddon>
                                            https://
                                        </InputLeftAddon>
                                        <Input placeholder='vod link' onChange={e => setUrl(e.currentTarget.value)}/>
                                        <InputRightAddon>
                                            .com
                                        </InputRightAddon>
                                    </InputGroup>
                                    <FormHelperText>The link to your vod. Might be youtube, twitch, etc...</FormHelperText>
                                </FormControl>
                            </Stack>
                        </ModalBody>

                        <ModalFooter mt={4}>
                            <Button
                                colorScheme='blue'
                                mr={3}
                                onClick={onClose}
                                rightIcon={<CloseIcon/>}
                            >
                                Close
                            </Button>
                            <Button rightIcon={<AddIcon/>} type="submit">Add</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}