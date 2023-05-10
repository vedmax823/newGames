import React, { useContext, useEffect, useState } from 'react';
import { GameState } from '../Models/GameState';
import { GCard } from '../Models/GCard';
import { Box, Grid } from '@mui/material';
import CardComponent from './CardComponent';
import SelectedCardsComponent from './SelectedCardsComponent';
import { FieldLeftTopContext, FieldLeftTopType } from '../MainFieldSpider';
import EmptyCardComponent from './EmptyCardComponent';
import AdditionalLine from './AdditionalLine';
import MovingCard from './MovingCard';
import StopCardComponent from './StopCardComponent';
import '../style/spider.css'
import SolvedCardsComponent from './SolvedCardsComponent';
import SelfMovingLineComponent from './SelfMovingLineComponent';

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
    const [solvedCards, setSolvedCards] = useState<GCard[]>()
    const [selfMoving, setSelfMoving] = useState<{cards : GCard[], topEnd : number, leftEnd : number, lineStart : number, lineEnd : number}>()
    let mouseHoldTimeout : ReturnType<typeof setTimeout>;
    const mouseDownHandle = (card: GCard, index: number, cardIndex: number) => {
        mouseHoldTimeout = setTimeout(() => {
            if (card.isOpen) {
                const findCardsArr = gameState.getSelectedCards(index, cardIndex)
                if (!findCardsArr) return
                handleSetGameState(findCardsArr[1])
                setSelectedLine(() => index)
                selectCardHandle(findCardsArr[0])
            }
        }, 100)
    }

    const handleAdditionalOpen = (cards: CardsCoordsType) => {
        setAdditionalOpened(cards)
    }


    const clickOnCard = (card: GCard, indexCard: number, indexLine: number) => {
        if (mouseHoldTimeout) {
            clearTimeout(mouseHoldTimeout);
        }
        if (!card.isOpen) return 

        const searchLine = gameState.findBestMOve(card, indexLine)
        if (searchLine == -1) return
        const findCardsArr = gameState.getSelectedCards(indexLine, indexCard)
        if (!findCardsArr) return
        handleSetGameState(findCardsArr[1])
        let newCoords ={top : 0, left : 0}
        if (gameState.lines[searchLine].length == 0){
            newCoords = {
                top : gameState.linesCoords[searchLine].top, 
                left : gameState.linesCoords[searchLine].left
            }
        }
        else{
            newCoords = {
                top : gameState.lines[searchLine][gameState.lines[searchLine].length - 1].top + 25, 
                left : gameState.lines[searchLine][gameState.lines[searchLine].length - 1].left
            }
        }
        setSelfMoving(() => {
            return {
                cards : findCardsArr[0],
                topEnd : newCoords.top,
                leftEnd : newCoords.left,
                lineStart : indexLine,
                lineEnd : searchLine
            }
        })


        // console.log(searchLine)
        // console.log(card, indexCard, indexLine)
        // selectCardHandle(undefined)
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
            const indexLine = gameState.lines.findIndex(line => line.length == 0)
            if (indexLine !== -1) return
            const additionsList = gameState.additional[index]
            handleAdditionalOpen({ cards: additionsList, coords: coords })
            const newGameState = gameState.copyGameState(gameState)
            newGameState.additional.pop()
            handleSetGameState(newGameState)
        }
    }


    useEffect(() => {
        if (additionalOpened) {
            setTimeout(() => {
                const newGameState = gameState.copyGameState(gameState)
                additionalOpened.cards.forEach((card, index) => {
                    card.setOpen()
                    newGameState.lines[index].push(card)
                })
                setAdditionalOpened(undefined)
                handleSetGameState(newGameState)
                // console.log('test')
            }, 500)
        }
    }, [additionalOpened])



    useEffect(() => {
        const indexLine = gameState.findSolvedCards()
        if (indexLine !== -1) {
            const newGameState = gameState.copyGameState(gameState)
            const solvedCards = newGameState.lines[indexLine].splice(newGameState.lines[indexLine].length - 13, 13)
            if (newGameState.lines[indexLine].length > 0) newGameState.lines[indexLine][newGameState.lines[indexLine].length - 1].setOpen()
            setSolvedCards(() => solvedCards)
            handleSetGameState(newGameState)
        }
    }, [gameState])

    useEffect(() => {
        if (solvedCards) {
            setTimeout(() => {
                const newGameState = gameState.copyGameState(gameState)
                if (newGameState.fullCells[0].length == 0) newGameState.fullCells[0] = [...solvedCards]
                else {
                    newGameState.fullCells.push([...solvedCards])
                }
                setSolvedCards(() => undefined)
                handleSetGameState(newGameState)
            }, 500)
        }
    }, [solvedCards])

    useEffect(() => {
        if(selfMoving){
            setTimeout(() => {
                const newGameState = gameState.copyGameState(gameState)
                newGameState.lines[selfMoving.lineEnd].push(...selfMoving.cards)
                if (newGameState.lines[selfMoving.lineStart].length !== 0)
                    newGameState.lines[selfMoving.lineStart][newGameState.lines[selfMoving.lineStart].length - 1].setOpen()
                setSelfMoving(() => undefined)
                handleSetGameState(newGameState)
            }, 500)
        }
    }, [selfMoving])

    return (
        <div className='rootDivSpider'>
            <Grid item xs={12}>
                kjhkh
            </Grid>
            <Grid item xs={12}>
                <Grid item container xs={12} justifyContent="space-between">
                    <Grid sx={{ ml: 2, minWidth: "8vw", minHeight: '11vw', borderRadius: 3, position: "relative" }}>

                        <StopCardComponent />
                        {
                            gameState.additional.map((item, index) => <AdditionalLine index={index} line={item} key={index} clickOnAdditional={clickOnAdditional} />)
                        }
                    </Grid>
                    <Grid xs={9} item container justifyContent="space-between">
                        {
                            [...Array(8)].map((_, index) => <SolvedCardsComponent key={index} indexLine={index} gameState={gameState} />)
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
                                    // 
                                    onClick={() => clickOnCard(cart, index, indexLine)}
                                    onMouseDown={() => mouseDownHandle(cart, indexLine, index)}
                                    key={index}
                                    sx={{
                                        minWidth: '8vw',
                                        height: '11vw',
                                        color: "black",
                                        borderRadius: 3,
                                        position: "absolute",
                                        top: top,
                                    }}
                                >
                                    <CardComponent card={cart} />
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
                additionalOpened && additionalOpened.cards.length > 0 && additionalOpened.cards.map((card, index) => {
                    // console.log(index, additionalOpened.cards.length)
                    card.setOpen()
                    return (<MovingCard
                        key={index}
                        indexLine={index}
                        card={card}
                        coorStart={additionalOpened.coords}
                        coorEnd={{
                            top: gameState.lines[index][gameState.lines[index].length - 1].top + 25,
                            left: gameState.lines[index][gameState.lines[index].length - 1].left
                        }}

                    />
                    )
                })
            }
            {
                solvedCards ?
                    solvedCards.map((card, index) =>
                        <MovingCard
                            key={index}
                            indexLine={index}
                            card={card}
                            coorStart={{ top: card.top, left: card.left }}
                            coorEnd={{
                                top: gameState.findPossibleEmptyTop(),
                                left: gameState.findPossibleEmptyLeft()
                            }}

                        />)
                    : null

            }
            {
                selfMoving ? <SelfMovingLineComponent cardLine={selfMoving.cards} topEnd={selfMoving.topEnd} leftEnd={selfMoving.leftEnd}/> : null
            }

        </div>
    );
};

export default CardsField;