import { Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import CardComponent from './CardComponent';
import { GCard } from '../Models/GCard';
import { FieldLeftTopType } from '../MainFieldSpider';
import '../style/spider.css'

interface MovingCardProps {
    card: GCard,
    coorStart: FieldLeftTopType,
    coorEnd: FieldLeftTopType,
    indexLine: number
}

const MovingCard = ({ card, coorStart, coorEnd, indexLine }: MovingCardProps) => {
    const boxRef = useRef<HTMLDivElement>()
    const [coords, setCoords] = useState(coorStart)

    useEffect(() => {
        if (boxRef.current) {
            setCoords(coorEnd)
        }
    }, [boxRef])

    return (
        <Box
            ref={boxRef}
            // style={{transform: `translateX(${coorEnd.left}px) translateY(${coorEnd.top}%)`}}
            className="boxClass"
            sx={{
                minWidth: '8vw',
                height: '11vw',
                borderRadius: 3,
                position: "absolute",
                top: coords.top,
                left: coords.left,
            }}
        >
            <CardComponent card={card} />
        </Box>

    );
};

export default MovingCard;