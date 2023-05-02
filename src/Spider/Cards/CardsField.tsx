import React, { useContext, useEffect, useState } from 'react';
import { GameState } from '../Models/GameState';
import { GCard } from '../Models/GCard';
import { Box, Grid } from '@mui/material';
import CardBackComponent from './CardBackComponent';
import CardComponent from './CardComponent';
import SelectedCardsComponent from './SelectedCardsComponent';
import { FieldLeftTopContext, FieldLeftTopType } from '../MainFieldSpider';
import EmptyCardComponent from './EmptyCardComponent';
import AdditionalLine from './AdditionalLine';
import MovingCard from './MovingCard';

interface CardsFieldsProps {
    gameState: GameState;
    selectedCards: GCard[] | undefined;
    selectCardHandle: (cards: GCard[] | undefined) => void;
    handleSetGameState: (newGameState: GameState) => void;
}

type CardsCoordsType = {
    cards: GCard[],
    coords: FieldLeftTopType
}

const CardsField = ({ gameState, selectedCards, selectCardHandle, handleSetGameState }: CardsFieldsProps) => {
    const [selectedLine, setSelectedLine] = useState<number>()
    const fieldCoords = useContext(FieldLeftTopContext)
    const [additionalOpened, setAdditionalOpened] = useState<CardsCoordsType>()
    const mouseDownHandle = (card: GCard, index: number, cardIndex: number) => {
        if (card.isOpen) {
            const findCardsArr = gameState.getSelectedCards(index, cardIndex)
            if (!findCardsArr) return
            handleSetGameState(findCardsArr[1])
            setSelectedLine(() => index)
            selectCardHandle(findCardsArr[0])
        }
    }

    const handleAdditionalOpen = (cards: CardsCoordsType) => {
        setAdditionalOpened(cards)
    }


    const mouseUpHandle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (selectedCards) {
            const index = gameState.findLineLindex(e.clientY - fieldCoords.top, e.clientX - fieldCoords.left, selectedCards[0])
            if (selectedLine !== undefined) {
                const newGameState = gameState.copyGameState(gameState)
                if (index !== -1) {
                    newGameState.lines[index].push(...selectedCards)
                    if (newGameState.lines[selectedLine].length > 0) newGameState.lines[selectedLine][newGameState.lines[selectedLine].length - 1].setOpen()
                }
                else {
                    newGameState.lines[selectedLine].push(...selectedCards)
                }
                handleSetGameState(newGameState)
            }
        }
        selectCardHandle(undefined)
    }

    const clickOnAdditional = (index: number, coords: FieldLeftTopType) => {
        if (gameState.additional.length - 1 == index) {
            const additionsList = gameState.additional[index]
            handleAdditionalOpen({ cards: additionsList, coords: coords })
            const newGameState = gameState.copyGameState(gameState)
            newGameState.additional.pop()
            handleSetGameState(newGameState)
        }
    }

    const endOfMoving = (card : GCard, index : number) => {
        const newGameState = gameState.copyGameState(gameState)
        card.setOpen()
        newGameState.lines[index].push(card)
        handleSetGameState(newGameState)
        if (!additionalOpened) return
        if (additionalOpened.cards.length == 1) return setAdditionalOpened(undefined)

        const newCards = additionalOpened.cards.filter((card, index) => additionalOpened.cards.length -1 !== index)
        setAdditionalOpened({cards : newCards, coords : {...additionalOpened.coords}})

    }

    return (
        <div className='rootDivSpider'>
            <Grid item xs={12}>
                kjhkh
            </Grid>
            <Grid item xs={12}>
                <Grid item container xs={1} justifyContent="space-between">
                    <Grid sx={{ ml: 2, minWidth: "8vw", minHeight: '11vw', background: "white", borderRadius: 3, position: "relative" }}>
                        {
                            gameState.additional.map((item, index) => <AdditionalLine index={index} line={item} key={index} clickOnAdditional={clickOnAdditional} />)
                        }
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="space-around" sx={{ mt: 2 }}>
                {[...Array(10)].map((_, indexLine) =>
                    <Grid key={indexLine} sx={{ minWidth: '8vw', minHeight: '11vw', borderRadius: 3, position: "relative" }}>
                        <Box
                            sx={
                                {
                                    minWidth: '8vw',
                                    height: '11vw',
                                    color: "black",
                                    borderRadius: 3,
                                    position: "absolute",
                                    top: 0,
                                }}

                        >
                            <EmptyCardComponent indexLine={indexLine} gameState={gameState} />
                        </Box>
                        {
                            gameState.lines[indexLine].map((cart, index) => {

                                const top = index * 25
                                return <Box
                                    onMouseDown={() => mouseDownHandle(cart, indexLine, index)}
                                    key={index}
                                    sx={
                                        {
                                            minWidth: '8vw',
                                            height: '11vw',
                                            color: "black",
                                            borderRadius: 3,
                                            position: "absolute",
                                            top: top,
                                        }}
                                >
                                    {cart.isOpen ? <CardComponent card={cart} /> : <CardBackComponent />}
                                </Box>
                            })
                        }
                    </Grid>)
                }
            </Grid>
            {
                selectedCards ? <SelectedCardsComponent cards={selectedCards} mouseUpHandle={mouseUpHandle} /> : null
            }
            {
                additionalOpened && additionalOpened.cards.map((card, index) => {
                    // console.log(index, additionalOpened.cards.length)
                    if (additionalOpened.cards.length -1 !== index) return (
                        <Box
                            key={index}
                            sx={
                                {
                                    minWidth: '8vw',
                                    height: '11vw',
                                    color: "black",
                                    borderRadius: 3,
                                    position: "absolute",
                                    top: additionalOpened.coords.top,
                                    left: additionalOpened.coords.left
                                }}
                        >
                            <CardComponent card={card} key={index} />
                        </Box>)
                    return (<MovingCard
                        key={index}
                        indexLine={index}
                        card={card}
                        coorStart={additionalOpened.coords}
                        coorEnd={{
                            top: gameState.lines[index][gameState.lines[index].length - 1].top,
                            left: gameState.lines[index][gameState.lines[index].length - 1].left
                        }}
                        endOfMoving={endOfMoving}
                    />)
                })
            }

        </div>
    );
};

export default CardsField;