export interface IPlayer {
    name: string;
    temp_id: string;
}

export interface IDeployedShip {
    x: number;
    y: number;
    owner: IPlayer;
    destroyed: boolean;
}

interface GameDocument {
    detail_players: IPlayer[]

    player_states: (IPlayer & {
        state: {
            code: "DEPLOYING_SHIP" | "READY"
        }
    })[];

    ships: {
        player: IPlayer;
        ships: IDeployedShip[];
    }[];

    which_turn: IPlayer | null;

    game_status: "FINISHED" | "PLAYING" | "WAITING_PLAYER";

    winner: IPlayer | null;

    hit_mark_miss: {
        hitter: IPlayer;
        coords: { x: number; y: number }[]
    }[]
}

export default GameDocument;
