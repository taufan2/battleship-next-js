import React, {Component} from 'react';
import {Container, SimpleGrid} from "@chakra-ui/react";
import MapCellDeploying from "../play/MapCellDeploying";


interface Props {
    x: number;
    y: number;
    deployedShips: { x: number; y: number }[];
    onCellClick: (x: number, y: number) => void;
}

class MapDeployingShips extends Component<Props> {

    onCellClick = (x: number, y: number) => {
        this.props.onCellClick(x, y);
    }

    render() {
        const rangeX = [...new Array(this.props.x)].map((value, index) => index);
        const rangeY = [...new Array(this.props.y)].map((value, index) => index);

        return (
            <Container p={0} maxWidth={'container.xl'}>
                <SimpleGrid columns={this.props.x} gap={1}>
                    {
                        rangeY.map(
                            value => rangeX.map(
                                value1 => <MapCellDeploying
                                    key={`${value1}-${value}`}
                                    onClick={() => this.onCellClick(value1, value)}
                                    ship={
                                        !!this.props.deployedShips.find(value2 => value2.x == value1 && value2.y === value) ??
                                        false
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

export default MapDeployingShips;