import {
    Button,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel,
    useDisclosure,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react';

import { AddIcon, ViewIcon } from '@chakra-ui/icons';

export function AddModalComponent(){
    const { isOpen, onOpen, onClose } = useDisclosure()
    return(
        <>
            <Button variant={"outline"} colorScheme="messenger" maxWidth={"max-content"} onClick={onOpen}>
              Add
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Stats</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Add
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='red' mr={2} onClick={onClose}>
                        Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}