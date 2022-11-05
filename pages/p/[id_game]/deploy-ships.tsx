import React, {Component} from 'react';
import {Box, Button, Center, Container, Text} from "@chakra-ui/react";
import MapDeployingShips from "../../../components/deployShips/MapDeployingShips";
import MainLayout from "../../../components/MainLayout/MainLayout";
import {withRouter} from "next/router";
import {WithRouterProps} from "next/dist/client/with-router";
import {doc, getDoc, setDoc} from "@firebase/firestore";
import {myFirestore} from "../../../config/firebase/firebase";
import GameDocument from "../../../config/firebase/GameDocument/GameDocument";
import {GetServerSideProps} from "next";
import {myFirestoreAdmin} from "../../../config/firebase/firebaseAdmin";
import GameDocumentTypes from "../../../config/firebase/GameDocument/GameDocumentTypes";

interface IDeployShipsProps extends WithRouterProps {
    game: GameDocumentTypes & { ref: string };
    playerId: string;
    playerExists: boolean;
}

interface IDeployShipsStates {
    x: number;
    y: number;
    maxShipDeploy: number,
    deployedShips: { x: number; y: number }[];
    creatingGame: boolean;
}

class DeployShips extends Component<IDeployShipsProps, IDeployShipsStates> {

    constructor(props: IDeployShipsProps) {
        super(props);

        const row = 8;
        const col = 8;

        this.state = {
            x: col,
            y: row,
            maxShipDeploy: 5,
            deployedShips: [],
            creatingGame: false,
        }
    }

    onCellClick = (x: number, y: number) => {
        const currentState = {...this.state}

        const find = currentState.deployedShips.find(value => value.x === x && value.y === y);

        if (!find) {
            if (currentState.deployedShips.length == 5) return;
            currentState.deployedShips.push({
                x, y
            });
        } else {
            currentState.deployedShips = currentState.deployedShips.filter(
                value => {
                    if (value.x === x && value.y === y) return false;
                    return true;
                }
            )
        }

        this.setState(currentState);
    }

    onSubmitCreateGame = async () => {
        if (!this.props.router.query?.id_game) return false;

        await this.setState({
            creatingGame: true,
        })

        const player = this.props.game.detail_players.find(value => value.temp_id === this.props.playerId);
        if (!player) throw new Error("Player Not Exists");

        const id_game: string = this.props.router.query.id_game as string;

        const docRef = doc(myFirestore, 'games', id_game);
        const getGameDoc = await getDoc(docRef.withConverter<GameDocument>(GameDocument.converter));
        const data = getGameDoc.data()!;

        data.ships.push({
            player: player,
            ships: this.state.deployedShips.map(value => {
                return {
                    x: value.x,
                    y: value.y,
                    destroyed: false,
                    owner: player,
                }
            })
        })

        let myStates = data.player_states.find(value => value.temp_id === this.props.playerId);
        if (!myStates) throw new Error("States Not Found!");
        myStates.state.code = "READY";

        data.hit_mark_miss.push({
            hitter: player,
            coords: [],
        });

        if (data.detail_players.length === 2) {
            data.game_status = "PLAYING"
        }

        await setDoc(docRef.withConverter<GameDocument>(GameDocument.converter), data);

        this.props.router.replace(`/p/${id_game}`)
    }

    render() {

        return (
            <MainLayout>
                <Container maxWidth={"container.lg"} padding={'15px'}>
                    <Center paddingY={"15px"} bg={'gray.100'} style={{marginBottom: "1em"}}>
                        <Text>Tempatkan kapal anda</Text>
                    </Center>

                    <Container maxWidth={"container.sm"}>
                        <Center>
                            <MapDeployingShips x={this.state.x} y={this.state.y}
                                               deployedShips={this.state.deployedShips}
                                               onCellClick={this.onCellClick}/>
                        </Center>

                        <Box style={{marginTop: "15px"}}>
                            <Text>
                                Anda sudah
                                menempatkan {this.state.deployedShips.length} dari {this.state.maxShipDeploy} kapal.
                            </Text>
                        </Box>
                        <Box style={{marginTop: "15px"}}>
                            <Button
                                isLoading={this.state.creatingGame}
                                onClick={this.onSubmitCreateGame}
                                colorScheme={'teal'}
                                variant={'solid'}
                                disabled={this.state.deployedShips.length < 5}
                            >
                                Mulai Permainan
                            </Button>
                        </Box>
                    </Container>


                </Container>
            </MainLayout>
        );
    }
}

export const getServerSideProps: GetServerSideProps = async ({req, res, ...ctx}) => {
    const idGame = ctx.params?.id_game;
    if (!idGame) throw new Error("ID GAME NOT FOUND")
    const docRef = myFirestoreAdmin.collection("games").doc(idGame as string);
    const get = await docRef.withConverter<GameDocument>(GameDocument.converter).get();
    if (!get.exists) throw new Error("ID GAME NOT FOUND");
    const data = get.data()!;

    let userCookieId = req.cookies?.["_id"] ?? null;
    if (!userCookieId) {
        const fromHeader = res.getHeader("X-USER-ID");
        userCookieId = (!!fromHeader) ? fromHeader as string : null;
        res.removeHeader("X-USER-ID");
    }

    const findMe = data.detail_players.find(value => {
        return value.temp_id === userCookieId;
    });

    const playerExist: boolean = !!findMe;

    return {
        props: {
            game: data.toJson(true),
            playerId: userCookieId,
            playerExists: playerExist,
        }
    }
}

export default withRouter(DeployShips);