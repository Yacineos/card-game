export type Deck = {
    success: boolean,
    deck_id: string,
    shuffled: boolean,
    remaining: number
}

export type Card = {
    code: string,
    image: string,
    value: number,
    suit: string
}

export type Cards = {
    success: boolean,
    deck_id: string,
    cards: Card[]
}

export const CARDS_API = "https://deckofcardsapi.com/api/deck/"
