import React, {useState} from 'react';
import {Button, Center, Container, Text} from "@chakra-ui/react";
import MainLayout from "./MainLayout/MainLayout";
import {useRouter} from "next/router";
import {doc, getDoc, setDoc} from "@firebase/firestore";
import {myFirestore} from "../config/firebase/firebase";
import GameDocument from "../config/firebase/GameDocument/GameDocument";

interface IProps {
    playerId: string;
}

function ConfirmJoinGame(props: IProps) {
    const router = useRouter();
    const [isButtonLoading, setButtonLoading] = useState<boolean>(false);

    const onWantToPlay = async () => {
        setButtonLoading(true);

        const idGame = router.query.id_game as string;

        const docRef = doc(myFirestore, "games", idGame);

        const getGameDoc = await getDoc(docRef.withConverter<GameDocument>(GameDocument.converter));

        const data = getGameDoc.data()!;

        const player = {
            temp_id: props.playerId,
            name: "Player 2",
        }

        data.detail_players.push({
            ...player,
        });

        data.player_states.push({
            ...player,
            state: {
                code: "DEPLOYING_SHIP"
            }
        });

        await setDoc(docRef.withConverter<GameDocument>(GameDocument.converter), data);

        router.replace(`/p/${idGame}/deploy-ships`)
    }

    return <MainLayout>
        <Container maxWidth={"container.lg"}
                   paddingY={"15px"}
        >
            <Center paddingY={"15px"} bg={'gray.100'} style={{marginBottom: "1em"}}>
                <Text>
                    Lawan sudah siap menunggu Anda, apakah anda ingin bermain?
                </Text>
            </Center>
            <Center>
                <Button isLoading={isButtonLoading}
                        colorScheme={'teal'}
                        onClick={onWantToPlay}
                >Ya, Saya Ingin Bermain</Button>
            </Center>
        </Container>
    </MainLayout>
}

export default ConfirmJoinGame;