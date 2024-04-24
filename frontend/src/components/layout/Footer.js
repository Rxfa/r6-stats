import {Box, Button, Container, Stack, useColorModeValue, VisuallyHidden, Text} from "@chakra-ui/react";
import {FaGithub, FaInstagram, FaTwitter, FaYoutube} from "react-icons/fa";

function SocialButton({children, label, href}){
    return (
        <Button
            rounded={'full'}
            cursor={'pointer'}
            as={'a'}
            href={href}
            display={'inline-flex'}
            alignItems={'center'}
            justifyContent={'center'}
            transition={'background 0.3s ease'}>
            <VisuallyHidden>{label}</VisuallyHidden>
            {children}
        </Button>
    )
}

export default function Footer() {
    return (
        <Box>
            <Container
                as={Stack}
                maxW={'6xl'}
                py={4}
                direction={{ base: 'column', md: 'row' }}
                spacing={4}
                justify={{ base: 'center', md: 'space-between' }}
                align={{ base: 'center', md: 'center' }}>
                <Text>© 2024 Rxfa. All rights reserved</Text>
                <Stack direction={'row'} spacing={6}>
                    <SocialButton label={'GitHub'} href={'#'}>
                        <FaGithub href={"https://github.com/rxfa"}/>
                    </SocialButton>
                </Stack>
            </Container>
        </Box>
    )
}