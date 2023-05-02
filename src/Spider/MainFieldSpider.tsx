import React, { createContext, useEffect, useRef, useState } from 'react';
import './style/spider.css'
import { GameState } from './Models/GameState';
import CardsField from './Cards/CardsField';
import { GCard } from './Models/GCard';


export type FieldLeftTopType = {
    top: number,
    left: number
}

const fieldLeftTopZero = { top: 0, left: 0 }
export const FieldLeftTopContext = createContext<FieldLeftTopType>({ top: 0, left: 0 })
export const MouseCoordsContext = createContext<FieldLeftTopType | undefined>(undefined)


const MainFieldSpider = () => {
    const [gameState, setGameState] = useState(new GameState(1))
    const [selectedCards, setSelectedCards] = useState<GCard[]>()
    const [mouseCoords, setMouseCoords] = useState<FieldLeftTopType>()
    const [fieldLeftTop, setFieldLeftTop] = useState<FieldLeftTopType>(fieldLeftTopZero)
    
    const refField = useRef<HTMLDivElement>(null)

    const handleSetGameState = (newGameState : GameState) => {
        setGameState(() => newGameState)
    }

    const selectCardHandle = (cards: GCard[] | undefined) => {
        setMouseCoords(() => undefined)
        setSelectedCards(() => cards)
    }


    const mouseMoveHandle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (selectedCards) {
            setMouseCoords(() => {
                return { top: e.pageY - fieldLeftTop.top - 50, left: e.pageX - fieldLeftTop.left - 50}
            })
        }
    }

    useEffect(() => {
        if (refField.current) {
            const coorField = refField.current.getBoundingClientRect()
            setFieldLeftTop({ top: coorField.y, left: coorField.x })
        }
    }, [refField])

    return (
        <MouseCoordsContext.Provider value={mouseCoords}>
            <FieldLeftTopContext.Provider value={fieldLeftTop} >
                <div ref={refField} onMouseMove={(e) => mouseMoveHandle(e)}>
                    <CardsField 
                        gameState={gameState} 
                        selectedCards={selectedCards} 
                        selectCardHandle={selectCardHandle} 
                        handleSetGameState={handleSetGameState}
                    />
                </div>
            </FieldLeftTopContext.Provider>
        </MouseCoordsContext.Provider>
    )
};

export default MainFieldSpider;