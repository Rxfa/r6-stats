'use client'
import "../globals.css";
import {Providers} from "@/app/providers";
import {fonts} from "@/app/fonts";
import {theme} from "@/app/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {Flex} from "@chakra-ui/react";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {isAuthenticated} from "@/app/api/utils";

export default function RootLayout({ children }) {
    const router = useRouter();

    useState(() => {
        if(!isAuthenticated()){
            router.push('/signin')
        }
    }, []);

    return (
        <html lang="en">
            <body className={fonts.rubik.variable}>
                <Providers theme={theme}>
                    <Flex justifyContent={"space-between"} flexDirection={"column"} minH={"100%"}>
                        <Navbar/>
                        {children}
                        <Footer/>
                    </Flex>
                </Providers>
            </body>
        </html>
    );
}
