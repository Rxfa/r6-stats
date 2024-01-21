import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    useDisclosure,
} from '@chakra-ui/react';
import {useRef} from "react";

export function DeleteAlertComponent() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    return(
      <>
        <Button colorScheme="red" variant={"outline"} maxWidth={"max-content"} onClick={onOpen}>
          Delete
        </Button>
        <AlertDialog 
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef} 
          onClose={onClose}
          isOpen={isOpen} 
          isCentered
        >
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete game
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you Sure? 
              You won't be able to undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onClose} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }