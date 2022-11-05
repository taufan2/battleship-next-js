import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import {createWrapper} from "next-redux-wrapper";
import {modalCreateNewGameReducer} from "./modalCreateNewGame/modalCreateNewGameSlice";

const makeStore = () =>
    configureStore({
        reducer: {
           modalCreateNewGameReducer,
        },
        devTools: true,
    });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    AppState,
    unknown,
    Action>;

export const storeWrapper = createWrapper<AppStore>(makeStore);