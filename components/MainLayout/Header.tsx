import {Box, Container, Flex, HStack, useColorModeValue,} from '@chakra-ui/react';
import {useDispatch} from "react-redux";
import {modalCreateNewGameActions} from "../../redux/modalCreateNewGame/modalCreateNewGameSlice";
import styles from "./Header.module.css";

export default function Header() {

    const dispatch = useDispatch();

    const onCreateNewGameClick = () => {
        dispatch(modalCreateNewGameActions.openModal());
    }

    return (
        <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <Container maxWidth={"container.lg"}>
                    <HStack spacing={8} alignItems={'center'}>
                        <Box>
                            <span className={styles.title}>
                                Battleship
                            </span>
                        </Box>
                    </HStack>
                </Container>
            </Flex>
        </Box>
    );
}