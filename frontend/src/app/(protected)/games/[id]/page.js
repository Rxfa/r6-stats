'use client'
import {Center, Heading} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getGame} from "@/app/api/getGame";

export default function Page(){

    const router = useRouter()
    const [game, setGame] = useState({});

    useEffect(() => {
        if(!router.isReady) return;
        getGame(router.query.id).then(game =>
            setGame(game)
        );
    }, [router.isReady]);

    return(
        <Center>
            <Heading>{game.map}</Heading>
        </Center>
    )
}