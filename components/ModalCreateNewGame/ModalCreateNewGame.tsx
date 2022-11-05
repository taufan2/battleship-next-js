import React, {ChangeEvent, Component} from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";
import {AppState} from "../../redux/store";
import {compose, Dispatch} from "redux";
import {connect} from "react-redux";
import {modalCreateNewGameActions} from "../../redux/modalCreateNewGame/modalCreateNewGameSlice";
import GameDocument from "../../config/firebase/GameDocument/GameDocument";
import * as crypto from "crypto";
import {addDoc, collection} from "@firebase/firestore";
import {myFirestore} from "../../config/firebase/firebase";

import validator from "validator";
import {withRouter} from "next/router";
import {WithRouterProps} from "next/dist/client/with-router";

interface IModalCreateGameProps
    extends ReturnType<typeof dispatchToProps>,
        ReturnType<typeof stateToProps>,
        WithRouterProps {
}

interface IModalCreateGameStates {
    inGameName: string;
    creatingGame: boolean;
}

class ModalCreateNewGame extends Component<IModalCreateGameProps, IModalCreateGameStates> {

    constructor(props: IModalCreateGameProps) {
        super(props);

        this.state = {
            inGameName: "",
            creatingGame: false,
        }
    }

    onClose = () => {
        this.props.modalClose()
    }

    onIgnChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            inGameName: e.target.value,
        })
    }

    disabledCreateButton = () => {
        let disabled = false;
        const n = this.state.inGameName;
        if (validator.isEmpty(n)) disabled = true;
        else if (!validator.isLength(n, {min: 3, max: 25})) disabled = true;

        return disabled;
    }

    onSubmitCreateGame = async () => {
        await this.setState({
            creatingGame: true,
        })

        let currentState = {...this.state};

        const temp_id = crypto.randomBytes(16).toString("hex");
        const player = {
            name: this.state.inGameName,
            temp_id: temp_id,
        }

        const gameDocument = new GameDocument();
        gameDocument.ships = [];
        gameDocument.game_status = "PLAYING";
        gameDocument.detail_players = [
            player,
        ];
        gameDocument.player_states = [
            {
                ...player,
                state: {
                    code: "DEPLOYING_SHIP",
                }
            }
        ];
        gameDocument.which_turn = null;
        gameDocument.winner = null;

        const docRef = await addDoc(
            collection(myFirestore, "games").withConverter(GameDocument.converter),
            gameDocument
        );

        this.props.router.push(`/p/${docRef.id}/deploy-ship`).then(this.onClose);


    }

    render() {
        return (
            <Modal isOpen={this.props.modalCreateNewGame.open} onClose={this.onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Buat Game</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Nama Pemain</FormLabel>
                            <Input placeholder={'Masukan Nama Anda'} value={this.state.inGameName}
                                   onChange={this.onIgnChange}/>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            isLoading={this.state.creatingGame}
                            onClick={this.onSubmitCreateGame}
                            colorScheme='teal'
                            mr={3}
                            disabled={this.disabledCreateButton()}
                        >
                            Buat Game
                        </Button>
                        <Button variant='ghost' onClick={this.onClose}>Batal</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        );
    }
}

const stateToProps = (states: AppState) => {
    return {
        modalCreateNewGame: states.modalCreateNewGameReducer,
    };
}

const dispatchToProps = (dispatch: Dispatch) => {
    return {
        modalClose: () => dispatch(modalCreateNewGameActions.closeModal()),
    }
}

const wrap = compose<any>(
    withRouter,
    connect(stateToProps, dispatchToProps)
)(ModalCreateNewGame);

export default wrap;
