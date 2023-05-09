import { Box } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import CardComponent from './CardComponent';
import { GCard } from '../Models/GCard';
import { FieldLeftTopContext, FieldLeftTopType } from '../MainFieldSpider';
import '../style/spider.css'

interface MovingCardProps {
    card: GCard,
    coorStart: FieldLeftTopType,
    coorEnd: FieldLeftTopType,
    endOfMoving : (card : GCard, index : number) => void,
    indexLine : number
}

const MovingCard = ({ card, coorStart, coorEnd, endOfMoving, indexLine }: MovingCardProps) => {
    const boxRef = useRef<HTMLDivElement>()
    const [coords, setCoords] = useState(coorStart)
    // const delta = 50
    // const tg = (coorEnd.top - coorStart.top) / (coorEnd.left - coorStart.left)
    // const b = coorEnd.top - tg * coorEnd.left
    // const fieldTopLeft = useContext(FieldLeftTopContext)

    // useEffect(() => {
    //     if(boxRef.current){
    //         const divCoor = boxRef.current.getBoundingClientRect()
    //         console.log(divCoor.top - fieldTopLeft.top, coorEnd.top)
    //         if (Math.abs(divCoor.top - fieldTopLeft.top - (coorEnd.top + 25)) < 10) endOfMoving(card, indexLine)
    //     }
    // }, [boxRef])

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //       const newTop = coords.top + delta
    //       const newLeft = (newTop - b ) / tg

    //       setCoords(() => {return {top : newTop, left : newLeft}})
    //     }, 50);
    //     // console.log(coorEnd)
    //     // console.log(coords)
    //     // console.log(coorEnd.top - coords.top, coorEnd.left - coords.left)
    //     if ((coords.top > coorEnd.top)){
    //         endOfMoving(card, indexLine)
    //         //setCoords({top : coorEnd.top + 25, left : coorEnd.left})
    //         clearInterval(interval)
    //         // setCoords({top : coorEnd.top, left : coorEnd.left})
    //     }
    //     return () => clearInterval(interval);
    //   }, [coords]);

    useEffect(() => {
        if (boxRef.current){
            setCoords(coorEnd)
        }
    }, [boxRef])


    useEffect(() => {
        // setSecondBoxHandle()
        if (boxRef.current) {
          setTimeout(() => endOfMoving(card, indexLine), 500)
          
        }
      }, [coords])

    return (
        
        <Box
            ref={boxRef}
        // style={{transform: `translateX(${coorEnd.left}px) translateY(${coorEnd.top}%)`}}
            className="boxClass"
            sx={{
                minWidth: '8vw',
                height: '11vw',
                color: "black",
                borderRadius: 3,
                position: "absolute",
                top: coords.top,
                left: coords.left,
                // transition: "transform 0.2s linear",
                // transform : `translateX(${coorEnd.left - coorStart.left}px) translateY(${coorEnd.top - coorStart.top + 25}px)`
            }}
        >
            <CardComponent card={card} />
        </Box>
        
    );
};

export default MovingCard;