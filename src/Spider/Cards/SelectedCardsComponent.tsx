import React, { useContext, useEffect } from 'react';
import { GCard } from '../Models/GCard';
import CardComponent from './CardComponent';
import { Box, Grid } from '@mui/material';
import { MouseCoordsContext } from '../MainFieldSpider';

interface SelectedCardsProps {
    cards: GCard[],
    mouseUpHandle: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void

}

const SelectedCardsComponent = ({ cards, mouseUpHandle }: SelectedCardsProps) => {
    const mouseCoords = useContext(MouseCoordsContext)

    return (
        <Grid
            sx={{
                minWidth: '8vw',
                minHeight: '11vw',
                background: 'white',
                borderRadius: 3,
                position: "absolute",
                top: mouseCoords ? mouseCoords.top : cards[0].top,
                left: mouseCoords ? mouseCoords.left : cards[0].left
            }}
            onMouseUp={(e) => mouseUpHandle(e)}
        >
            {
                cards.map((card, index) => {
                    const top = index * 25
                    return <Box
                        key={index}
                        sx={{
                            minWidth: '8vw',
                            height: '11vw',
                            color: "black",
                            background: 'white',
                            borderRadius: 3,
                            position: "absolute",
                            top:{ top }
                        }}
                    >
                        <CardComponent card={card} />
                    </Box>
                }
                )
            }
        </Grid>

    );
};

export default SelectedCardsComponent;