import { Box } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { GCard } from '../Models/GCard';
import { FieldLeftTopContext, FieldLeftTopType } from '../MainFieldSpider';
import CardComponent from './CardComponent';

interface AdditionalLineProps {
    index: number,
    line: GCard[],
    clickOnAdditional : (index : number, coords : FieldLeftTopType) => void;
}

const AdditionalLine = ({ index, clickOnAdditional, line }: AdditionalLineProps) => {
    const [coords, setCoords] = useState({top : 0, left : 0})
    const lineRef = useRef<HTMLDivElement>()
    const fieldTopLeft = useContext(FieldLeftTopContext)

    useEffect(() => {
        if (lineRef.current){
            const coor = lineRef.current.getBoundingClientRect()
            setCoords({top : coor.top - fieldTopLeft.top, left : coor.left - fieldTopLeft.left})
        }
    }, [lineRef, fieldTopLeft])
    const left = index * 20




    return (
        <Box
            ref={lineRef}
            onClick={() => clickOnAdditional(index, coords)}
            sx={
                {
                    minWidth: '8vw',
                    height: '11vw',
                    color: "black",
                    borderRadius: 3,
                    position: "absolute",
                    left: left,
                }}
        >
            {
                line.map((card, index) => <CardComponent key={index} card={card} />)
            }
        </Box>
    )
};

export default AdditionalLine;