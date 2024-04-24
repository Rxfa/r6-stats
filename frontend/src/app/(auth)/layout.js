import "../globals.css";
import {Providers} from "@/app/providers";
import {fonts} from "@/app/fonts";
import {theme} from "@/app/theme";
import Footer from "@/components/layout/Footer";
import {Flex, Spacer} from "@chakra-ui/react";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={fonts.rubik.variable}>
        <Providers theme={theme}>
            <Flex justifyContent={"space-between"} flexDirection={"column"} height={"100%"}>
                <Spacer/>
                {children}
                <Spacer/>
                <Footer mt={"auto"}/>
            </Flex>
        </Providers>
        </body>
        </html>
    );
}