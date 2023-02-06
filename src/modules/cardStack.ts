import CardDeck from "./cardDeck";
import * as PIXI from 'pixi.js';

class CardStack {
    private cards: PIXI.Sprite[];
    private fanAngle = 20;
    private fanWidth = 2;
    // public position: Object = {x: null, y: null};

    constructor() {
        this.cards = [];
        // this.position.x = window.innerWidth / 2;
        // this.position.y = window.innerHeight * 0.99;
    }

    public addCard(card: PIXI.Sprite) {
        this.cards.push(card);
        this.updateStack();
    }

    private updateStack() {
        const numCards = this.cards.length;
        const maxFanAngle = 150;
        const maxFanWidth = window.innerWidth * 0.02;
        let currentFanAngle = 0;
        let currentFanWidth = 0;

        for (let i = 0; i < numCards; i++) {
            const card = this.cards[i];
            card.pivot.x = card.width / 2;
            card.pivot.y = card.height / 2;

            if (currentFanAngle + this.fanAngle > maxFanAngle) {
                currentFanAngle = 0;
                currentFanWidth += maxFanWidth;
            }

            card.position.x = currentFanWidth;
            card.position.y = currentFanAngle;
            card.rotation = currentFanAngle * (Math.PI / 180);
            currentFanAngle += this.fanAngle;
        }
    }
}

export default CardStack;