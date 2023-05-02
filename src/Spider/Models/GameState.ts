import { EnumSuit, EnumValue, GCard } from "./GCard";

const cardTypesArray = [EnumValue.ONE, EnumValue.TWO, EnumValue.THREE, EnumValue.FOUR, EnumValue.FIVE, EnumValue.SIX, EnumValue.SEVEN, EnumValue.EIGHT, EnumValue.NINE, EnumValue.TEN, EnumValue.JACK, EnumValue.QWEEN, EnumValue.KING]

enum SuiutsEnum {
    ONE = 1,
    TWO = 2,
    FOUR = 4
}

type LeftTopType = {
    top : number,
    left : number,
    width : number,
    height : number
}

export class GameState {
    lines: [GCard[]]
    additional: [GCard[]]
    fullCells: GCard[]
    howMachSuiuts: SuiutsEnum
    linesCoords : LeftTopType[]

    constructor(howMachSuiuts: SuiutsEnum) {
        this.fullCells = []
        const [lines, additional] = this.InitState(howMachSuiuts)
        this.lines = lines
        this.additional = additional
        this.howMachSuiuts = howMachSuiuts
        this.InitState(howMachSuiuts)
        this.linesCoords = this.initEmpty()
    }

    private InitState(howMachSuiuts: SuiutsEnum): [[GCard[]], [GCard[]]] {
        let allCards: GCard[] = []
        let lines: [GCard[]] = [[]]
        if (howMachSuiuts == 1) allCards = this.createAllCardsOne()
        if (howMachSuiuts == 2) allCards = this.createAllCardsTWo()
        if (howMachSuiuts == 4) allCards = this.createAllCardsFour()
        const shuffledCards = this.shuffleArray(allCards)
        for (let i = 0; i < 4; i++) {
            const line = shuffledCards.splice(0, 6)
            line[line.length - 1].setOpen()
            lines[i] = line
        }
        for (let i = 4; i < 10; i++) {
            const line = shuffledCards.splice(0, 5)
            line[line.length - 1].setOpen()
            lines[i] = line
        }
        let additionalCards: [GCard[]] = [[]]
        for (let i = 0; i < 5; i++) {
            const line = shuffledCards.splice(0, 10)
            additionalCards[i] = line
        }
        return [lines, additionalCards]
    }

    private createAllCardsOne(): GCard[] {
        const deck = [...Array(8)].reduce((acc,) => {
            cardTypesArray.forEach(item => {
                const card = new GCard(item, EnumSuit.SPADES)
                acc.push(card)
            })
            return acc
        }, [])
        return deck
    }

    private createAllCardsTWo(): GCard[] {
        let deck = [...Array(4)].reduce((acc,) => {
            cardTypesArray.forEach(item => {
                const card = new GCard(item, EnumSuit.SPADES)
                acc.push(card)
            })
            return acc
        }, [])
        deck = [...Array(4)].reduce((acc,) => {
            cardTypesArray.forEach(item => {
                const card = new GCard(item, EnumSuit.HEARTS)
                acc.push(card)
            })
            return acc
        }, [])
        return deck
    }

    private createAllCardsFour(): GCard[] {
        let deck = [...Array(2)].reduce((acc,) => {
            cardTypesArray.forEach(item => {
                const card = new GCard(item, EnumSuit.SPADES)
                acc.push(card)
            })
            return acc
        }, [])
        deck = [...Array(2)].reduce((acc,) => {
            cardTypesArray.forEach(item => {
                const card = new GCard(item, EnumSuit.HEARTS)
                acc.push(card)
            })
            return acc
        }, deck)
        deck = [...Array(2)].reduce((acc,) => {
            cardTypesArray.forEach(item => {
                const card = new GCard(item, EnumSuit.CLUBS)
                acc.push(card)
            })
            return acc
        }, deck)
        deck = [...Array(2)].reduce((acc,) => {
            cardTypesArray.forEach(item => {
                const card = new GCard(item, EnumSuit.DIAMONDS)
                acc.push(card)
            })
            return acc
        }, deck)
        return deck
    }

    private shuffleArray(array: GCard[]): GCard[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }

    private initEmpty() : LeftTopType[]{
        return [...Array(10)].map((_) => {
            return {top : 0, left : 0, width : 0, height : 0}
        })
    }

    copyGameState(gameState: GameState): GameState {
        const newGamestate = new GameState(gameState.howMachSuiuts)
        newGamestate.lines = gameState.lines
        newGamestate.additional = gameState.additional
        newGamestate.fullCells = gameState.fullCells
        newGamestate.linesCoords = gameState.linesCoords
        return newGamestate
    }

    findLineLindex(y: number, x: number, firstCard: GCard): number {
        let result = -1;
        this.lines.forEach((item, index) => {
            if (item.length > 0) {
                const card = item[item.length - 1]
                if (card.isOpen && (card.top < y) && (card.top + card.height > y) && (card.left < x) && (card.left + card.width > x) && (card.value - firstCard.value == 1)) {
                    result = index
                }
            }
            else{
                const line = this.linesCoords[index]
                if ((line.top < y) && (line.top + line.height > y) && (line.left < x) && (line.left + line.width > x)){
                    result = index
                }
            }
        })
        return result
    }

    getSelectedCards(indexLine: number, indexCard: number): [GCard[], GameState] | undefined {
        const line = this.lines[indexLine]
        const newGameState = this.copyGameState(this)
        if (line.length - 1 == indexCard) {
            const card = line[indexCard]
            newGameState.lines[indexLine].pop()
            return [[card], newGameState]
        }
        let flag = true
        for (let index = indexCard; index < line.length - 1; index++) {
            if ((line[index].suit !== line[index + 1].suit) || (line[index].value - line[index + 1].value !== 1)) flag = false
        }
        if (flag) {
            const cards = newGameState.lines[indexLine].splice(indexCard, newGameState.lines[indexLine].length - indexCard)
            return [cards, newGameState]
        }
        return undefined
    }

    setEmptyCoords(indexLine : number, y : number, x : number, width : number, height : number){
        this.linesCoords[indexLine] = {top : y, left : x, width, height}
    }
}