import { Box } from '@mui/material';
import { useContext, useEffect, useRef } from 'react';
import { FieldLeftTopContext } from '../MainFieldSpider';
import { GameState } from '../Models/GameState';
import CardComponent from './CardComponent';

interface SolvedCardProps {
    indexLine: number,
    gameState: GameState,
}

const SolvedCardsComponent = ({ indexLine, gameState }: SolvedCardProps) => {
    const ref = useRef<HTMLDivElement>()
    const fieldTopLeft = useContext(FieldLeftTopContext)
    useEffect(() => {
        if (ref.current) {
            const coor = ref.current.getBoundingClientRect()
            gameState.setSolvedCoords(indexLine, coor.top - fieldTopLeft.top, coor.left - fieldTopLeft.left, coor.width, coor.height)
        }
    }, [ref, fieldTopLeft])
    return (
        <Box ref={ref} sx={
            {
                minWidth: '8vw',
                height: '11vw',
                color: "black",
                borderRadius: 3,
            }}>
            {(gameState.fullCells[7 - indexLine] && gameState.fullCells[7 - indexLine].length !== 0) ?
                <Box
                    sx={
                        {
                            minWidth: '8vw',
                            height: '11vw',
                            color: "black",
                            borderRadius: 3,
                            position : "absolute"
                        }}
                >
                    <CardComponent card={gameState.fullCells[7 - indexLine][0]} />
                </ Box>
                :
                <img
                    src="images/cardsImgs/emptySpace.png"
                    width="100%"
                    height="100%"
                    draggable={false}
                />
            }
        </Box>
    );
};

export default SolvedCardsComponent;