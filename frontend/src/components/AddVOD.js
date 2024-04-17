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

export default function AddVOD(){
    const { isOpen, onOpen, onClose } = useDisclosure()
    return(
        <>
            <Button onClick={onOpen} w={"100%"}>Add VOD</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add VOD</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack gap={4}>
                            <FormControl isRequired>
                                <FormLabel>Vs</FormLabel>
                                <Input type='text' />
                                <FormHelperText>The team you played against</FormHelperText>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Notes</FormLabel>
                                <Input type='text' />
                            </FormControl>
                            <FormControl>
                                <FormLabel>VOD URL</FormLabel>
                                <InputGroup size='sm'>
                                    <InputLeftAddon>
                                        https://
                                    </InputLeftAddon>
                                    <Input placeholder='vod link' />
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
                        <Button rightIcon={<AddIcon/>}>Add</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}