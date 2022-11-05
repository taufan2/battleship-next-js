import React, {Component} from 'react';
import {GridItem} from "@chakra-ui/react";
import {IDeployedShip} from "../../config/firebase/GameDocument/GameDocumentTypes";
import styles from "./MapCellMySelf.module.css";
import {AiOutlineCheckCircle, AiOutlineCloseCircle} from "react-icons/ai"
import {FaShip} from "react-icons/fa"

interface IProps {
    ship?: IDeployedShip;
    hitMarker?: boolean;
}

class MapCellMySelf extends Component<IProps> {
    render() {

        if ((this.props.ship && !this.props.ship.destroyed)) {
            return <GridItem
                onClick={() => {
                }}
                height={"50"}
                className={`${styles.mapCell} ${styles.myCellHasShip}`}
            >
                <FaShip
                    size={30}
                />
            </GridItem>
        }

        if ((this.props.ship && this.props.ship.destroyed)) {
            return <GridItem
                onClick={() => {
                }}
                height={"50"}
                className={`${styles.mapCell} ${styles.myShipDestroyed}`}
            >
                <AiOutlineCloseCircle
                    size={30}
                />
            </GridItem>
        }

        if (!this.props.ship && this.props.hitMarker) {
            return <GridItem
                onClick={() => {
                }}
                height={"50"}
                className={`${styles.mapCell} ${styles.myCellNormal}`}
            >
                <AiOutlineCheckCircle
                    size={30}
                />
            </GridItem>
        }

        return (
            <GridItem
                onClick={() => {
                }}
                height={"50"}
                className={`${styles.mapCell} ${styles.myCellNormal}`}
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

export default MapCellMySelf;