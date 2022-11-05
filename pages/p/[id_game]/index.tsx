import React, {Component} from 'react';
import MainLayout from "../../../components/MainLayout/MainLayout";
import {Center, Container, Grid, GridItem, Heading, Text} from "@chakra-ui/react";
import MapPlayBattle from "../../../components/play/MapPlayBattle";
import {GetServerSideProps} from "next";
import {myFirestoreAdmin} from "../../../config/firebase/firebaseAdmin";
import GameDocument from "../../../config/firebase/GameDocument/GameDocument";
import GameDocumentTypes from "../../../config/firebase/GameDocument/GameDocumentTypes";
import ConfirmJoinGame from "../../../components/ConfirmJoinGame";
import {doc, DocumentReference, DocumentSnapshot, onSnapshot, setDoc, Unsubscribe} from "@firebase/firestore";
import {myFirestore} from "../../../config/firebase/firebase";

interface IProps {
    game: GameDocumentTypes & { ref: string };
    playerId: string;
    playerExists: boolean;
}

interface IStates {
    game: IProps['game'];
}

class Index extends Component<IProps, IStates> {
    private gameDocRef!: DocumentReference;
    private unsub!: Unsubscribe;
    private gameObject!: GameDocument;

    constructor(props: IProps) {
        super(props);

        this.gameDocRef = doc(myFirestore, this.props.game.ref);

        this.state = {
            game: props.game,
        }
    }

    componentDidMount() {
        this.unsub = onSnapshot(
            this.gameDocRef.withConverter<GameDocument>(GameDocument.converter),
            this.onDocUpdate
        );
    }

    onDocUpdate = async (snapshot: DocumentSnapshot<GameDocument>) => {
        const data = snapshot.data();
        if (!data) return;

        this.gameObject = data;

        const currentState = {...this.state};

        currentState.game = {
            ref: snapshot.ref.path,
            ...data.toJson(),
        }

        await this.setState({...currentState});

        const {enemy: countEnemyShips, mine: countMyShips} = this.shipCount();

        if ((countEnemyShips === 0 || countMyShips === 0) && this.state.game.game_status === "PLAYING") {
            const enemy = this.state.game.detail_players.find(value => value.temp_id !== this.props.playerId);
            const me = this.state.game.detail_players.find(value => value.temp_id === this.props.playerId);
            if (countEnemyShips === 0) this.gameObject.winner = me!;
            if (countMyShips === 0) this.gameObject.winner = enemy!;
            this.gameObject.game_status = "FINISHED";
            await setDoc(
                this.gameObject.ref.withConverter<GameDocument>(GameDocument.converter),
                this.gameObject,
            )
            this.unsub();
        }
    }

    onCellEnemyClicked = async (x: number, y: number, indexExists: number | null) => {
        if (this.gameObject.game_status === "FINISHED") return;

        const enemy = this.state.game.detail_players.find(value => value.temp_id !== this.props.playerId);

        if (indexExists !== null) {
            const ships = this.gameObject.ships.find(value => value.player.temp_id !== this.props.playerId);
            if (!ships) return;
            ships.ships[indexExists].destroyed = true;
        } else {
            const markMiss = this.gameObject.hit_mark_miss
                .find(value => value.hitter.temp_id === this.props.playerId);
            markMiss?.coords.push({
                x, y
            });
        }

        if (enemy) {
            this.gameObject.which_turn = enemy;
        }

        await setDoc(
            this.gameObject.ref.withConverter<GameDocument>(GameDocument.converter),
            this.gameObject,
        )

    }

    isMyTurn = () => {
        const {game} = this.state;
        return game.which_turn?.temp_id === this.props.playerId;
    }

    disableEnemyGrid = () => {
        const {game} = this.state;
        let disable = false;

        if (!this.isMyTurn()) disable = true;

        const enemyState = game.player_states.find(value => value.temp_id !== this.props.playerId);
        const myState = game.player_states.find(value => value.temp_id === this.props.playerId);
        if (enemyState?.state.code === "DEPLOYING_SHIP" || myState?.state.code === "DEPLOYING_SHIP") disable = true;

        return disable;
    }

    messageStatus = () => {
        const {game} = this.state;
        const enemyState = game.player_states.find(value => value.temp_id != this.props.playerId);
        const myState = game.player_states.find(value => value.temp_id === this.props.playerId);

        if (this.state.game.game_status === "FINISHED") {
            if (this.state.game.winner?.temp_id === this.props.playerId) return  "ANDA MENANG!!";
            else return "ANDA KALAH!!"
        }

        if (!enemyState) {
            return "Menunggu lawan masuk";
        }

        if (game.game_status === "WAITING_PLAYER") {
            if (enemyState?.state.code === "DEPLOYING_SHIP") {
                return "Menunggu lawan menempatkan kapalnya";
            }
        }

        if (game.game_status === "PLAYING") {

            if (enemyState?.state.code === "READY" && myState?.state.code === "READY") {
                if (this.isMyTurn()) return "Giliran Anda menyerang";
                else return "Giliran lawan menyerang";
            }
        }

        return "NO_STATES";
    }

    shipCount = (): { enemy: number; mine: number } => {
        const myShips = this.state.game.ships.find(value => value.player.temp_id === this.props.playerId);
        const myShipNotDestroyed = myShips?.ships.filter(value => !value.destroyed).length ?? 0;

        const enemyShips = this.state.game.ships.find(value => value.player.temp_id !== this.props.playerId);
        const enemyShipsNotDestroyed = enemyShips?.ships.filter(value => !value.destroyed).length ?? 0;
        return {enemy: enemyShipsNotDestroyed, mine: myShipNotDestroyed};
    }

    render() {
        if (!this.props.playerExists) {
            return <ConfirmJoinGame playerId={this.props.playerId}/>
        }

        return (
            <MainLayout>
                <Container maxWidth={"container.lg"}
                           paddingY={"15px"}
                >
                    <Center paddingY={"15px"} bg={'gray.100'} style={{marginBottom: "1em"}}>
                        <Text>{this.messageStatus()}</Text>
                    </Center>

                    <Grid
                        templateAreas={`"myGrid enemyGrid"`}
                        gap={5}
                    >
                        <GridItem area={"myGrid"}>
                            <Heading size={'md'} mb={5}>Kapal Anda</Heading>
                            <MapPlayBattle
                                x={8} y={8}
                                onCellClick={() => {}}
                                hitMarks={
                                    this.state.game.hit_mark_miss
                                        .find(value => value.hitter.temp_id !== this.props.playerId)?.coords ?? []
                                }
                                mapOwner={"MINE"}

                                deployedShips={
                                    this.state.game.ships.find(value => value.player.temp_id === this.props.playerId)
                                        ?.ships ?? []
                                }

                            />
                            <Text mt={5}>
                                Sisa Kapal Anda : {this.shipCount().mine}
                            </Text>
                        </GridItem>
                        <GridItem area={"enemyGrid"}>
                            <Heading size={'md'} mb={5}>Kapal Musuh</Heading>
                            <MapPlayBattle
                                x={8} y={8} onCellClick={this.onCellEnemyClicked}
                                mapOwner={"ENEMY"}
                                disabledGrids={this.disableEnemyGrid()}
                                hitMarks={
                                    this.state.game.hit_mark_miss
                                        .find(value => value.hitter.temp_id === this.props.playerId)?.coords ?? []
                                }
                                deployedShips={
                                    this.state.game.ships.find(value => value.player.temp_id !== this.props.playerId)
                                        ?.ships ?? []
                                }
                            />
                            <Text mt={5}>
                                Sisa Kapal Musuh : {this.shipCount().enemy}
                            </Text>
                        </GridItem>
                    </Grid>
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

    if (!playerExist && data.detail_players.length == 2) {
        throw new Error("REACH OUT MAX PLAYER!")
    }

    return {
        props: {
            game: data.toJson(true),
            playerId: userCookieId,
            playerExists: playerExist,
        }
    }
}

export default Index;