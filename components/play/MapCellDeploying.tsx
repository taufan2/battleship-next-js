import React, {Component} from 'react';
import {GridItem} from "@chakra-ui/react";
import styles from "./MapCellDeploying.module.css";
import {FaShip} from "react-icons/fa"

interface IProps {
    ship?: boolean;
    onClick: () => void;
}

class MapCellDeploying extends Component<IProps> {
    render() {

        if (this.props.ship) {
            return <GridItem
                onClick={this.props.onClick}
                height={"50"}
                className={`${styles.mapCell} ${styles.cellHasShip}`}
            >
                <FaShip
                    size={30}
                />
            </GridItem>
        }
        return (
            <GridItem
                onClick={this.props.onClick}
                height={"50"}
                className={`${styles.mapCell} ${styles.cellNormal}`}
            >
                <div
                    style={{
                        height: "30px", width: "30px"
                    }}
                />
            </GridItem>
        );
    }
}

export default MapCellDeploying;