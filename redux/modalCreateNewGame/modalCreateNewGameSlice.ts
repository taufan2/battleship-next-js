import {createSlice} from "@reduxjs/toolkit";
import hydrate from "../hydrate";

interface IInitialStates {
    open: boolean;
}

const initialStates: IInitialStates = {
    open: false,
}

const name = "modalCreateNewGame";

const modalCreateNewGameSlice = createSlice({
    name,
    initialState: {
        ...initialStates,
    },
    reducers: {
        openModal: (state) => {
            state.open = true;
        },

        closeModal: (state) => {
            state.open = false;
        },
    },

    extraReducers: hydrate(name),
});


const modalCreateNewGameReducer = modalCreateNewGameSlice.reducer;
const modalCreateNewGameActions = modalCreateNewGameSlice.actions;

export {modalCreateNewGameReducer, modalCreateNewGameActions};

export default modalCreateNewGameSlice;
