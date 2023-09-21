import { useState } from "react";
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
    useDisclosure
} from '@chakra-ui/react';

import { AddIcon, ViewIcon } from '@chakra-ui/icons';

function AddModalComponent(){
    const { isOpen, onOpen, onClose } = useDisclosure()
    return(
        <>
            <Button colorScheme="messenger" leftIcon={<AddIcon />} maxWidth={"max-content"} onClick={onOpen}>
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

function ViewModalComponent(){
    const { isOpen, onOpen, onClose } = useDisclosure()
    return(
        <>
            <Button colorScheme="messenger" mr={6} leftIcon={<ViewIcon />} maxWidth={"max-content"} onClick={onOpen}>
                View
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Stats</ModalHeader>
                    <ModalCloseButton />
                    <Tabs>
                        <TabList>
                            <Tab>General</Tab>
                            <Tab>Rounds</Tab>
                            <Tab>Individual</Tab>
                        </TabList>
                    </Tabs>
                    <ModalBody>
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

export default AddModalComponent;
