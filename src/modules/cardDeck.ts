import Card from './card';

class CardDeck {
    public cards: Card[];
    public nextCardIndex = 0;
    // private maxCachedCards = 5;
    private deckId: string = '';

    constructor() {
        this.cards = [];
    }

    private static async fetchDeckId(): Promise<string> {
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const data = await response.json();
        return data.deck_id;
    }

    public getNextCard(): Card {

        this.cacheCards(1);

        // console.log('card id', this.nextCardIndex)

        return this.cards[this.nextCardIndex++];

    }

    private async cacheCards(amount: number): Promise<void> {

        const response = await fetch(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=${amount}`);
        const data = await response.json();

        this.cards.push(...data.cards.map((card: any) => new Card(card.code, card.image)));

        for (let i = 1; i < this.cards.length; i++) {
            this.cards[i].loadImage()
        }

        await this.cards[0].loadImage();

    }

    public async cacheFirstCards(amount: number): Promise<void> {

        this.deckId = await CardDeck.fetchDeckId();
        await this.cacheCards(amount);

    }

}

export default CardDeck;