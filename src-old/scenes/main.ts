import * as PIXI from "pixi.js"
import {request} from "./request";
import gsap from "gsap";

// gsap.registerPlugin(ScrollTrigger, Draggable, Flip, MotionPathPlugin);

export class Main extends PIXI.Container {
    app: PIXI.Application;
    sprite: PIXI.Sprite;
    state: { velocity: { x: number; y: number } };
    deckSize: number = 52;

    constructor(app: PIXI.Application) {
        super();
        this.app = app;
        this.state = { velocity: { x: 1, y: 1 } };
        this.update = this.update.bind(this);

        this.addBackgroundGradient();

        this.sprite = new PIXI.Sprite(
            app.loader.resources['assets/hello-world.png'].texture
        );
        this.sprite.x = window.innerWidth / 2 - this.sprite.width / 2;
        this.sprite.y = window.innerHeight / 2 - this.sprite.height / 2;
        this.addChild(this.sprite);
        this.sprite.visible = false;

        // Handle window resizing
        window.addEventListener('resize', (e) => {
            this.sprite.x = window.innerWidth / 2 - this.sprite.width / 2;
            this.sprite.y = window.innerHeight / 2 - this.sprite.height / 2;
        });

        // Handle update
        app.ticker.add(this.update);

        request('get', 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').then(res => {

            const deckId: string = JSON.parse(res.data).deck_id;

            request('get', `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${this.deckSize}`).then(res => {

                const cards: [object] = JSON.parse(res.data).cards;

                cards.forEach((card: any) => {



                    console.log(card.image)



                });

                // console.log(JSON.parse(res.data).cards)
            })

        })



    }

    update(_: any, delta: number) {

        if (
            this.sprite.x <= 0 ||
            this.sprite.x >= window.innerWidth - this.sprite.width
        ) {
            this.state.velocity.x = -this.state.velocity.x;
        }
        if (
            this.sprite.y <= 0 ||
            this.sprite.y >= window.innerHeight - this.sprite.height
        ) {
            this.state.velocity.y = -this.state.velocity.y;
        }
        this.sprite.x += this.state.velocity.x;
        this.sprite.y += this.state.velocity.y;

    }

    gradient(from: string, to: string): PIXI.Texture {

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

    addBackgroundGradient() {

        const rect = new PIXI.Sprite(
            this.gradient('#1A4A1C', '#308834')
        );

        this.addChild(rect);

        // const testCard = new PIXI.Sprite(PIXI.Texture.from('https://deckofcardsapi.com/static/img/aceDiamonds.png'))
        // this.addChild(testCard);

        // gsap.to(testCard.position, {y: 500, duration: 5, delay: 1, ease: "power3.inOut"})


    }

}
