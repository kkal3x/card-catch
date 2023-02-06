import gsap from "gsap";
import Card from './card';
import Game from '../game';

class Stacks {
    private stacks: Card[][];
    private maxStackAngle: number = 150 / 180 * Math.PI;
    private maxCardAngle: number = 30 / 180 * Math.PI;
    private minCardAngle: number = 10 / 180 * Math.PI;
    private distance: number;
    private game: Game
    private currStackId: number = 0;

    constructor(game: Game) {
        this.game = game;
        this.stacks = [[], [], [], []];
        this.distance = 0.02 * game.width;

        this.resize();
    }

    public addCard(card: Card) {

        const cardStacksOffset = this.getCardStacksOffset();

        this.checkStackIsFull();

        this.stacks[this.currStackId].push(card);

        this.animateCardToStack(card, cardStacksOffset);

        this.recalculateStacksPositions(cardStacksOffset);

        this.recalculateCardsRotations();

    }

    public resize(): void {

        const cardStacksOffset = this.getCardStacksOffset();

        this.recalculateStacksPositions(cardStacksOffset);

    }

    private checkStackIsFull(): void {

        if (this.stacks[this.currStackId].length >= Math.round(this.maxStackAngle / this.minCardAngle)) {

            this.currStackId++;

        }

    }

    private animateCardToStack(card: Card, cardStacksOffset: number): void {

        let position = [
            this.currStackId * cardStacksOffset,
            this.game.height * 0.99 - this.game.height / 2
        ];

        card.sprite.rotation = 0;

        gsap.to(card.sprite.position, {x: position[0], y: position[1], duration: 0.5, delay: 0, ease: "power1.Out"});
        gsap.to(card.sprite.anchor, {y: 1, duration: 0.5, delay: 0, ease: "power1.Out"});

    }

    private recalculateStacksPositions(cardStacksOffset: number): void {

        if (this.game.width < cardStacksOffset * 2 * (this.currStackId + 1)) {
            cardStacksOffset = this.game.width / (this.currStackId + 1) / 2;
        }

        this.stacks.forEach((stack, i) => {

            stack.forEach(card => {
                gsap.to(card.sprite.position, {x: i * cardStacksOffset * 2 - this.currStackId * cardStacksOffset, y: this.game.height * 0.99 - this.game.height / 2, duration: 0.5, delay: 0, ease: "power1.Out"});
            });

        });

    }

    private recalculateCardsRotations(): void {

        for (let i = 0; i < this.stacks[this.currStackId].length; i++) {

            let angle = this.maxCardAngle;

            if (this.stacks[this.currStackId].length > this.maxStackAngle / this.maxCardAngle) {

                angle = this.maxStackAngle / this.stacks[this.currStackId].length;

            }

            gsap.to(this.stacks[this.currStackId][i].sprite, {rotation: angle * i - angle * (this.stacks[this.currStackId].length - 1) / 2, duration: 0.35, delay: 0, ease: "power1.Out"});

        }

    }

    private getCardStacksOffset(): number {

        let cardStacksOffset = this.game.cardsHeight + this.game.width * 0.01;

        if (this.game.width < cardStacksOffset * 2 * (this.currStackId + 1)) {
            cardStacksOffset = this.game.width / (this.currStackId + 1) / 2;
        }

        return cardStacksOffset;

    }

}

export default Stacks;