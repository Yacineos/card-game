export type Deck = {
    success: boolean,
    deck_id: string,
    shuffled: boolean,
    remaining: number
}

export type Card = {
    code: string,
    image: string,
    value: string,
    suit: string
}

export type Cards = {
    success: boolean,
    deck_id: string,
    cards: Card[]
}
export type Player = "Player1" | "Player2" 

export type GameState = {
    deck : Deck | undefined,
    isReset: boolean ,
    turn: Player,
    winner: Player | undefined 
}

export const CARDS_API = "https://deckofcardsapi.com/api/deck/"
