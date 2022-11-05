import React, {Component} from 'react';
import {Box, Button, Center, Container, Text,} from "@chakra-ui/react";
import MainLayout from "../components/MainLayout/MainLayout";
import MapDeployingShips from "../components/deployShips/MapDeployingShips";
import GameDocument from "../config/firebase/GameDocument/GameDocument";
import {addDoc, collection} from "@firebase/firestore";
import {myFirestore} from "../config/firebase/firebase";
import {withRouter} from "next/router";
import {WithRouterProps} from "next/dist/client/with-router";
import {GetServerSideProps} from "next";

interface IndexProps extends WithRouterProps {
    playerId: string;
}

interface IndexStates {
    x: number;
    y: number;
    maxShipDeploy: number,
    deployedShips: { x: number; y: number }[];

    creatingGame: boolean;
}

class Index extends Component<IndexProps, IndexStates> {

    constructor(props: IndexProps) {
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
        await this.setState({
            creatingGame: true,
        })

        const player = {
            name: "Player 1",
            temp_id: this.props.playerId,
        }

        const gameDocument = new GameDocument();
        gameDocument.ships = [
            {
                player,
                ships: this.state.deployedShips.map(value => ({
                    y: value.y,
                    x: value.x,
                    owner: player,
                    destroyed: false,
                }))
            }
        ];
        gameDocument.game_status = "WAITING_PLAYER";
        gameDocument.detail_players = [
            player,
        ];
        gameDocument.player_states = [
            {
                ...player,
                state: {
                    code: "READY",
                }
            }
        ];
        gameDocument.hit_mark_miss = [
            {
                hitter: player,
                coords: [],
            }
        ]
        gameDocument.which_turn = player;
        gameDocument.winner = null;

        const docRef = await addDoc(
            collection(myFirestore, "games").withConverter(GameDocument.converter),
            gameDocument
        );

        this.props.router.push(`/p/${docRef.id}`);

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
                            <MapDeployingShips x={this.state.x} y={this.state.y} deployedShips={this.state.deployedShips}
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
                                Buat Game
                            </Button>
                        </Box>
                    </Container>

                </Container>
            </MainLayout>
        );
    }
}

export const getServerSideProps: GetServerSideProps = async ({req, res, ...ctx}) => {
    let userCookieId = req.cookies?.["_id"] ?? null ;

    if (!userCookieId) {
        const fromHeader = res.getHeader("X-USER-ID") ;
        userCookieId = (!!fromHeader) ? fromHeader as string : null;

        res.removeHeader("X-USER-ID");
    }

    return {
        props: {
            playerId: userCookieId,
        }
    }
}

export default withRouter(Index);