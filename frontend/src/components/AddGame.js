import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, Button, Text, useDisclosure, FormControl, FormLabel, Input, FormHelperText, IconButton
} from '@chakra-ui/react'
import {AddIcon, CloseIcon} from "@chakra-ui/icons";
import {useState} from "react";

export default function AddGame(){
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedFiles, setSelectedFiles] = useState([])

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    return(
        <>
            <Button onClick={onOpen} w={"100%"}>Add Game</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Game</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input type="file" placeholder="Upload files" />
                    </ModalBody>

                    <ModalFooter>
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