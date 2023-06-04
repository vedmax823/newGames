import { useContext, useEffect, useRef } from 'react';
import { FieldLeftTopContext } from '../MainFieldSpider';
import { Box } from '@mui/material';
import { GameState } from '../Models/GameState';

interface EmptyCardProps {
    indexLine : number,
    gameState : GameState,
}

const EmptyCardComponent = ({indexLine, gameState} : EmptyCardProps) => {
    const ref = useRef<HTMLDivElement>()
    const fieldTopLeft = useContext(FieldLeftTopContext)
    useEffect(() => {
        if(ref.current){
            const coor = ref.current.getBoundingClientRect()
            gameState.setEmptyCoords(indexLine, coor.top - fieldTopLeft.top, coor.left - fieldTopLeft.left, coor.width, coor.height)
            //card.setTopLeft(coor.top - fieldTopLeft.top, coor.left - fieldTopLeft.left, coor.width, coor.height)
        }
    }, [ref, fieldTopLeft])
    return (
        <Box sx={{width : "100%", height : "100%"}} ref={ref}>
            <img
                src="images/cardsImgs/emptySpace.png"
                width="100%"
                height="100%"
                draggable={false}
            />
        </Box>
    );
};

export default EmptyCardComponent;