
class Card {
    public suit: string;
    public rank: string;
    public imageUrl: string;
    public image: HTMLImageElement = new Image();

    constructor(suit: string, rank: string, imageUrl: string) {
        this.suit = suit;
        this.rank = rank;
        this.imageUrl = imageUrl;
    }

    public loadImage(callback: () => void) {
        this.image = new Image();
        this.image.src = this.imageUrl;
        this.image.onload = callback;
    }
}

class CardDeck {
    private cards: Card[];
    private nextCardIndex = 0;
    private maxCachedCards = 5;
    private deckIdPromise: Promise<string>;

    constructor() {
        this.cards = [];
        this.deckIdPromise = this.fetchDeckId();
    }

    private async fetchDeckId(): Promise<string> {
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const data = await response.json();
        return data.deck_id;
    }

    private async loadCards(): Promise<void> {
        const deckId = await this.deckIdPromise;
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${this.maxCachedCards}`);
        const data = await response.json();
        this.cards = data.cards.map((card: any) => new Card(card.suit, card.value, card.image));
    }

    public async getNextCard(): Promise<Card> {
        if (this.nextCardIndex >= this.cards.length) {
            await this.loadCards();
            this.nextCardIndex = 0;
        }
        return this.cards[this.nextCardIndex++];
    }
}

export default CardDeck;
