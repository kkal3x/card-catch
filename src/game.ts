import gsap from "gsap";
import * as PIXI from 'pixi.js';
import Card from './modules/card';
import Deck from "./modules/deck";
import Stacks from "./modules/stacks";

class Game {

    public app: PIXI.Application;
    private readonly backgroundGradient: PIXI.Sprite;
    public width: number = window.innerWidth;
    public height: number = window.innerHeight;
    private readonly backgroundContainer: PIXI.Container = new PIXI.Container();
    private readonly mainContainer: PIXI.Container = new PIXI.Container();
    private readonly scoreContainer: PIXI.Container = new PIXI.Container();
    private readonly loaderContainer: PIXI.Container = new PIXI.Container();
    private readonly gameOverContainer: PIXI.Container = new PIXI.Container();
    private throwTime: number = 3000;

    public deck: Deck = new Deck();
    public thrownCards: Card[] = [];
    public stacks: Stacks = new Stacks(this);

    public cardsHeight: number = 0;
    public scoreCaught: number = 0;
    public scoreMissed: number = 0;

    private scoreTexts: PIXI.Text[] = [];

    constructor() {

        this.app = new PIXI.Application({
            resizeTo: window,
            resolution: window.devicePixelRatio,
            backgroundColor: 0x308834,
        });

        this.app.stage.addChild(this.backgroundContainer);
        this.app.stage.addChild(this.mainContainer);
        this.app.stage.addChild(this.scoreContainer);
        this.app.stage.addChild(this.loaderContainer);
        this.app.stage.addChild(this.gameOverContainer);
        this.scoreContainer.alpha = 0;

        this.backgroundGradient = Game.createBackgroundGradient();
        this.backgroundContainer.addChild(this.backgroundGradient);

        this.addScoreText();

        this.resize();
        window.addEventListener('resize', this.resize.bind(this));

        // this.app.ticker.add(() => {
        //     this.update();
        // });

        this.showLoader();

        this.deck.cacheFirstCards(5).then(() => {

            this.hideLoader();
            this.showScoreContainer();
            this.startGame();

        });

    }

    public addCard(card: PIXI.Sprite) {

        this.mainContainer.addChild(card);

    }

    public removeCard(card: PIXI.Sprite) {

        this.mainContainer.removeChild(card);

    }

    private resize(): void {

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.mainContainer.position.set(this.width / 2, this.height / 2);
        this.scoreContainer.position.set(this.width / 2, 0);
        this.loaderContainer.position.set(this.width / 2, this.height / 2);
        this.gameOverContainer.position.set(this.width / 2, this.height / 2);

        this.cardsHeight = this.height / 4;

        this.updateCardsScale();

        this.stacks.resize();

    }

    static gradient(from: string, to: string): PIXI.Texture {

        const c = document.createElement("canvas");
        c.width = 2000;
        c.height = 1000;
        const ctx = c.getContext("2d");

        if (ctx) {

            const grd = ctx.createLinearGradient(500,0,500,700);
            grd.addColorStop(0, from);
            grd.addColorStop(1, to);
            ctx.fillStyle = grd;
            ctx.fillRect(0,0,2000,1000);

        }

        return PIXI.Texture.from(c);

    }

    static createBackgroundGradient(): PIXI.Sprite {

        return new PIXI.Sprite(
            Game.gradient('#1A4A1C', '#308834')
        );

    }

    private startGame(): void {

        this.loopCardsThrow();

    }

    public loopCardsThrow(): void {

        if (this.deck.nextCardIndex >= 52) this.showGameOver();
        else {

            let card = this.deck.getNextCard();

            this.addCard(card.sprite);

            this.throwCard(card, false, () => {

                this.addScoreMissed();
                this.removeCard(card.sprite);
                this.loopCardsThrow();

            });

        }

    }

    public async throwCard(card: any, simulate: boolean, next: any): Promise<void> {

        this.thrownCards.push(card);

        const scale = this.cardsHeight / card.sprite.texture.height;

        const cardDiagonalLength = Math.pow((Math.pow(card.sprite.texture.height, 2) + Math.pow(card.sprite.texture.width, 2)), 0.5) * scale;

        const startPosition = [
            this.width / 2 + cardDiagonalLength / 2,
            this.height * Math.random() - this.height / 2
        ];

        const endPosition = [
            -this.width / 2 - cardDiagonalLength / 2,
            this.height * Math.random() - this.height / 2
        ];

        card.sprite.interactive = true;
        card.sprite.on('pointerdown', (event: any) => { this.clicked(event, card) });

        card.sprite.scale.set(scale);
        card.sprite.position.set(...startPosition);

        card.animations = [];

        const animRotation = gsap.to(card.sprite, {rotation: Math.PI * (Math.random() - 0.5) * (Math.random() * 8 + 2), duration: this.throwTime / 1000, delay: 0, ease: "power1.inOut"})

        if (simulate) {

            const animPosition = gsap.to(card.sprite.position, {x: 0, y: endPosition[1], duration: this.throwTime / 1000 / 2, delay: 0, ease: "power1.in"});

            card.animations.push(animRotation, animPosition);

            animPosition.then(() => this.clicked(null, card))

        } else {

            const animPosition = gsap.to(card.sprite.position, {x: endPosition[0], y: endPosition[1], duration: this.throwTime / 1000, delay: 0, ease: "power1.inOut"});

            card.animations.push(animRotation, animPosition);

            animPosition.then(next)

        }

    }

    private clicked(event: any, card: Card) {

        this.addScoreCaught();

        this.throwTime -= 50;

        card.sprite.interactive = false;

        card.animations.forEach(tween => {
            tween.kill();
        });

        this.addToStack(card);

    }

    private addToStack(card: Card) {

        const endRotation = card.sprite.rotation - (card.sprite.rotation % (Math.PI));

        const animRotation = gsap.to(card.sprite, {rotation: endRotation, duration: 0.2, delay: 0, ease: "power1.Out"})

        animRotation.then(() => {

            this.stacks.addCard(card);

            this.loopCardsThrow();

        });

    }

    private showLoader(): void {

        const loaderText = new PIXI.Text('Loading', {
            fontSize: 36,
            fill: 0xffffff
        });
        loaderText.anchor.set(0, 0.5);
        loaderText.position.x = -80;

        this.loaderContainer.addChild(loaderText);

        setInterval(() => {

            if (loaderText.text === 'Loading...') loaderText.text = 'Loading';
            else loaderText.text += '.';

        }, 150);

    }

    private showGameOver(): void {

        const gameOverOverlay = new PIXI.Graphics();
        gameOverOverlay.beginFill(0x000000);
        gameOverOverlay.drawRect(-3000 / 2, -3000 / 2, 3000, 3000);
        gameOverOverlay.alpha = 0;

        this.gameOverContainer.addChild(gameOverOverlay);

        const gameOverText = new PIXI.Text('GAME OVER!', {
            fontSize: 56,
            fontWeight: 700,
            fill: 0xffffff
        });
        gameOverText.anchor.set(0.5, 0.5);
        gameOverText.alpha = 0;

        this.gameOverContainer.addChild(gameOverText);

        gsap.to(gameOverOverlay, {alpha: 0.6, duration: 0.85, delay: 0, ease: "power1.Out"});

        gsap.to(gameOverText, {alpha: 1, duration: 0.4, delay: 0.1, ease: "power1.Out"});
        gameOverText.scale.set(1 / 10);
        gsap.to(gameOverText.scale, {x: 1, y: 1, duration: 0.85, delay: 0, ease: "elastic.out(1, 0.3)"});

    }

    private hideLoader(): void {

        this.loaderContainer.children.forEach(child => {
            child.visible = false;
            this.loaderContainer.removeChild(child);
            this.loaderContainer.visible = false
        });

    }

    private updateCardsScale(): void {

        this.deck.cards.forEach(card => {

            const scale = this.cardsHeight / card.sprite.texture.height;
            gsap.to(card.sprite.scale, {x: scale, y: scale, duration: 0.25, delay: 0, ease: "power1.Out"});

        });

    }

    private addScoreText(): void {

        const scoreCaught = new PIXI.Text('Caught: ' + this.scoreCaught, {
            fontSize: 24,
            fill: 0xffffff
        });
        scoreCaught.name = 'scoreCaught';
        scoreCaught.anchor.set(0, 0.5);
        scoreCaught.position.set(-50, 20);

        const scoreMissed = new PIXI.Text('Missed: ' + this.scoreMissed, {
            fontSize: 24,
            fill: 0xffffff
        });
        scoreMissed.name = 'scoreMissed';
        scoreMissed.anchor.set(0, 0.5);
        scoreMissed.position.set(-50, 50);

        this.scoreTexts.push(scoreCaught, scoreMissed);

        this.scoreContainer.addChild(scoreCaught);
        this.scoreContainer.addChild(scoreMissed);

    }

    private addScoreCaught(): void {

        this.scoreCaught++;

        this.scoreTexts.forEach(score => {
            if (score.name === 'scoreCaught') {

                score.text = 'Caught: ' + this.scoreCaught;

            }
        });

    }

    private addScoreMissed(): void {

        this.scoreMissed++;

        this.scoreTexts.forEach(score => {
            if (score.name === 'scoreMissed') {

                score.text = 'Missed: ' + this.scoreMissed;

            }
        });

    }

    private showScoreContainer(): void {

        gsap.to(this.scoreContainer, {alpha: 1, duration: 0.35, delay: 0, ease: "power1.Out"});

    }

}

export default Game;