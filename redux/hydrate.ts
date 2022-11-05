import {HYDRATE} from "next-redux-wrapper";


const hydrate = (name: string) => {
    return {
        [HYDRATE]: (state: any, action: any) => {
            return {
                ...state,
                ...action.payload[name],
            };
        },
    }
}

export default hydrate;