import GameDocumentTypes, {IPlayer} from "./GameDocumentTypes";
import {DocumentData, DocumentReference, QueryDocumentSnapshot, SnapshotOptions} from "@firebase/firestore";

class GameDocument implements GameDocumentTypes {
    public ref!: DocumentReference;
    public detail_players!: IPlayer[];
    public game_status!: GameDocumentTypes['game_status'];
    public player_states!: GameDocumentTypes['player_states'];
    public ships!: GameDocumentTypes['ships'];
    public which_turn!: GameDocumentTypes['which_turn'];
    public winner!: GameDocumentTypes["winner"];
    public hit_mark_miss!: GameDocumentTypes['hit_mark_miss'];

    toJson = (addRef?: boolean): GameDocumentTypes & { ref?: string } => {
        const final: GameDocumentTypes & {ref?: string} = {
            detail_players: this.detail_players,
            game_status: this.game_status,
            player_states: this.player_states,
            ships: this.ships,
            which_turn: this.which_turn,
            winner: this.winner,
            hit_mark_miss: this.hit_mark_miss,
        }

        if (addRef) final.ref = this.ref.path;

        return final;
    }

    public static converter: any = {
        fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions | undefined): GameDocument {
            const data = snapshot.data(options);

            const gameDocument = new GameDocument();
            gameDocument.detail_players = data.detail_players;
            gameDocument.game_status = data.game_status;
            gameDocument.player_states = data.player_states;
            gameDocument.ships = data.ships;
            gameDocument.which_turn = data.which_turn;
            gameDocument.winner = data.winner;
            gameDocument.ref = snapshot.ref;
            gameDocument.hit_mark_miss = data.hit_mark_miss;

            return gameDocument;
        },

        toFirestore(gameDocument: GameDocument): GameDocumentTypes {
            return gameDocument.toJson();
        }
    }
}

export default GameDocument;