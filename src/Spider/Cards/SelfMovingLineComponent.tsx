import { useEffect, useRef, useState } from 'react';
import { GCard } from '../Models/GCard';
import { Box } from '@mui/material';
import CardComponent from './CardComponent';
import '../style/spider.css'

interface SelfMovingLineComponentProps {
    cardLine: GCard[],
    topEnd: number,
    leftEnd: number
}

const SelfMovingLineComponent = ({ cardLine, topEnd, leftEnd }: SelfMovingLineComponentProps) => {
    const boxRef = useRef()
    const [coords, setCoords] = useState({ top: cardLine[0].top, left: cardLine[0].left })

    useEffect(() => {
        if (boxRef.current) {
            setCoords({ top: topEnd, left: leftEnd })
        }
    }, [boxRef])
    return (
        <Box
            className="boxClass"
            sx={
                {
                    minWidth: '8vw',
                    height: '11vw',
                    color: "black",
                    borderRadius: 3,
                    position: "absolute",
                    top: coords.top,
                    left: coords.left,
                }}
        >

            {
                cardLine.map((card, index) => {
                    const top = index * 25
                    return (
                        <Box
                            key={index}
                            ref={boxRef}
                            // style={{transform: `translateX(${coorEnd.left}px) translateY(${coorEnd.top}%)`}}
                            className="boxClass"
                            sx={{
                                minWidth: '8vw',
                                height: '11vw',
                                borderRadius: 3,
                                position: "absolute",
                                top : top
                            }}
                        >
                            <CardComponent card={card} />
                        </Box>
                    )
                })
            }
        </Box>




    );
};

export default SelfMovingLineComponent;