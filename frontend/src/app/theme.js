'use client';
import { extendTheme } from "@chakra-ui/react";


export const theme = extendTheme({
    fonts: {
        heading: 'var(--font-rubik)',
        body: 'var(--font-rubik)',
    },
    colors: {
        transparent: 'transparent',
        black: '#000000',
        white: '#ffffff',
        primary: {
                50: '#edf3f8',
                100: '#d6d7db',
                200: '#bcbdc0',
                300: '#a1a2a8',
                400: '#86888f',
                500: '#6c6e75',
                600: '#54565c',
                700: '#3c3d42',
                800: '#242529',
                900: '#0c0c13',
            },
        secondary: {
                50: '#e0ffeb',
                100: '#b8f6cf',
                200: '#8eefb1',
                300: '#63e792',
                400: '#39e074',
                500: '#1fc65a',
                600: '#149a45',
                700: '#096e30',
                800: '#00431b',
                900: '#001804',
            },
    }
});