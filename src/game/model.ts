import CardDeck from './card';

class GameModel {
    private score: number;

    constructor() {

        this.score = 0;

        this.initCards();

    }

    public updateScore(value: number) {
        this.score += value;
    }

    public getScore(): number {
        return this.score;
    }

    private async initCards() {

        const cardDeck = new CardDeck();

        const card = await cardDeck.getNextCard();

        console.log(card)

    }
}

export default GameModel;