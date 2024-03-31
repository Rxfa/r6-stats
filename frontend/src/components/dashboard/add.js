import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react';
import {FileUploadFormComponent} from "./fileUploadForm";

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
                        <FileUploadFormComponent />
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