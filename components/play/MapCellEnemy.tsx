import React, {Component} from 'react';
import {GridItem} from "@chakra-ui/react";
import {IDeployedShip} from "../../config/firebase/GameDocument/GameDocumentTypes";
import styles from "./MapCellEnemy.module.css";
import {AiOutlineCheckCircle} from "react-icons/ai"
import {BiRadioCircleMarked} from "react-icons/bi"

interface IProps {
    ship?: IDeployedShip;
    disabled?: boolean;
    hitMarker?: boolean;
    onClick?: () => void;
}

class MapCellEnemy extends Component<IProps> {
    onClick = () => {
        if (this.props.disabled) return;
        this.props.onClick?.();
    }

    render() {
        if ((this.props.ship && this.props.ship.destroyed)) {
            return <GridItem
                height={"50"}
                className={`${styles.mapCell} ${styles.enemyShipDestroyed}`}
            >
                <AiOutlineCheckCircle
                    size={30}
                />
            </GridItem>
        }

        if ((this.props.ship && this.props.ship.destroyed) && this.props.disabled) {
            return <GridItem
                onClick={this.onClick}
                height={"50"}
                className={`${styles.mapCell} ${styles.enemyShipDestroyed}`}
            >
                <AiOutlineCheckCircle
                    size={30}
                />
            </GridItem>
        }

        if ((this.props.ship && !this.props.ship.destroyed) && this.props.disabled) {
            return <GridItem
                onClick={this.onClick}
                height={"50"}
                className={`${styles.mapCell} ${styles.enemyCellDisabled}`}
            >
                <div
                    style={{
                        height: "30px", width: "30px"
                    }}
                />
            </GridItem>
        }

        if (!this.props.ship && !this.props.hitMarker && this.props.disabled) {
            return <GridItem
                onClick={this.onClick}
                height={"50"}
                className={`${styles.mapCell} ${styles.enemyCellDisabled}`}
            >
                <div
                    style={{
                        height: "30px", width: "30px"
                    }}
                />
            </GridItem>
        }

        if (this.props.hitMarker && this.props.disabled) {
            return <GridItem
                onClick={this.onClick}
                height={"50"}
                className={`${styles.mapCell} ${styles.enemyCellDisabled}`}
            >
                <BiRadioCircleMarked
                    size={30}
                />
            </GridItem>
        }

        if (this.props.hitMarker) {
            return <GridItem
                height={"50"}
                className={`${styles.mapCell} ${styles.enemyCellDisabled}`}
            >
                <BiRadioCircleMarked
                    size={30}
                />
            </GridItem>
        }


        return (
            <GridItem
                onClick={this.onClick}
                height={"50"}
                className={`${styles.mapCell} ${styles.enemyCellNormal}`}
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

export default MapCellEnemy;