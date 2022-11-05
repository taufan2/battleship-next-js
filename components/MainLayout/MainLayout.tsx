import React, {Component} from 'react';
import {Grid, GridItem} from "@chakra-ui/react";
import Header from "./Header";
import ModalCreateNewGame from "../ModalCreateNewGame/ModalCreateNewGame";
import {connect} from "react-redux";
import {AppState} from "../../redux/store";
import {compose, Dispatch} from "redux";

interface IMainLayoutProps
    extends ReturnType<typeof dispatchToProps>, ReturnType<typeof stateToProps>
{
    children: React.ReactNode;
}

class MainLayout extends Component<IMainLayoutProps> {
    render() {
        return (
            <React.Fragment>
                <Grid
                    templateAreas={`"header"
                  "main"
                  `}
                >
                    <GridItem area={'header'}>
                        <Header/>
                    </GridItem>
                    <GridItem area={'main'}>
                        {this.props.children}
                    </GridItem>
                </Grid>
                <ModalCreateNewGame  />
            </React.Fragment>
        );
    }
}


const stateToProps = (states: AppState) => {
    return {
        modalCreateNewGame: states.modalCreateNewGameReducer,
    };
}

const dispatchToProps = (dispatch: Dispatch) => {
    return {}
}

const wrap = compose(
    connect(stateToProps, dispatchToProps)
)(MainLayout);

export default wrap;
