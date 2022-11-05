import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {ChakraProvider} from "@chakra-ui/react"
import {storeWrapper} from "../redux/store";
import {FC} from "react";
import {Provider} from "react-redux";

const App: FC<AppProps> = ({Component, ...rest}) => {
    const {store, props} = storeWrapper.useWrappedStore(rest);

    return <Provider store={store}>
        <ChakraProvider>
            <Component {...props.pageProps} />
        </ChakraProvider>
    </Provider>
}

export default App;
