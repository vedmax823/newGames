import React, { useContext, useEffect, useRef} from 'react';
import { GCard } from '../Models/GCard';
import { Box } from '@mui/material';
import { FieldLeftTopContext, FieldLeftTopType } from '../MainFieldSpider';

interface CardComponentProps {
    card : GCard
}

const CardComponent = ({card}  : CardComponentProps) => {
    const ref = useRef<HTMLDivElement>()
    const fieldTopLeft = useContext(FieldLeftTopContext)
    useEffect(() => {
        if(ref.current){
            const coor = ref.current.getBoundingClientRect()
            card.setTopLeft(coor.top - fieldTopLeft.top, coor.left - fieldTopLeft.left, coor.width, coor.height)
        }
    }, [ref, fieldTopLeft])
    
    return (
        <Box sx={{width : "100%", height : "100%"}} ref={ref}>
        <img
            src={`images/cardsImgs/${card.suit.charAt(0)}${card.value}.png`}
            width="100%"
            height="100%"
            draggable={false}
        />
        </Box>
    );
};

export default CardComponent;