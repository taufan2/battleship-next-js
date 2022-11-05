import React, {Component} from 'react';
import {Container, SimpleGrid} from "@chakra-ui/react";
import {IDeployedShip} from "../../config/firebase/GameDocument/GameDocumentTypes";
import MapCellEnemy from "./MapCellEnemy";
import MapCellMySelf from "./MapCellMySelf";


interface Props {
    x: number;
    y: number;
    deployedShips: IDeployedShip[];
    onCellClick: (x: number, y: number, existsIndex: number | null) => void;
    mapOwner: "ENEMY" | "MINE";
    disabledGrids?: boolean;
    hitMarks: { x: number; y: number }[];
}

class MapPlayBattle extends Component<Props> {

    onCellClick = (x: number, y: number) => {
        const index = this.props.deployedShips.findIndex(value => value.x === x && value.y === y);
        this.props.onCellClick(x, y, (index > -1) ? index : null);
    }

    render() {
        const rangeX = [...new Array(this.props.x)].map((value, index) => index);
        const rangeY = [...new Array(this.props.y)].map((value, index) => index);

        return (
            <Container p={0} m={0}>
                <SimpleGrid columns={this.props.x} gap={1}>
                    {
                        rangeY.map(
                            value => rangeX.map(
                                value1 => this.props.mapOwner === "ENEMY" ? <MapCellEnemy
                                    onClick={() => this.onCellClick(value1, value)}
                                    key={`${value1}-${value}`}
                                    disabled={this.props.disabledGrids}
                                    hitMarker={
                                        !!this.props.hitMarks.find(value2 => value2.x === value1 && value2.y === value)
                                    }
                                    ship={
                                        this.props.deployedShips
                                            .find(value2 => value2.x === value1 && value2.y === value)
                                    }
                                /> : <MapCellMySelf
                                    key={value1}
                                    ship={
                                        this.props.deployedShips
                                            .find(value2 => value2.x === value1 && value2.y === value)
                                    }
                                    hitMarker={
                                        !!this.props.hitMarks.find(value2 => value2.x === value1 && value2.y === value)
                                    }
                                />
                            )
                        )
                    }
                </SimpleGrid>
            </Container>
        );
    }
}

export default MapPlayBattle;