import * as PIXI from 'pixi.js';

class GameView {

    private readonly app: PIXI.Application;
    private readonly scoreText: PIXI.Text;
    private readonly backgroundGradient: PIXI.Sprite;
    public width: number = window.innerWidth;
    public height: number = window.innerHeight;
    public backgroundContainer: PIXI.Container;
    public mainContainer: PIXI.Container;

    constructor() {

        this.app = new PIXI.Application({
            resizeTo: window,
            backgroundColor: 0x308834
        });

        this.backgroundContainer = new PIXI.Container();
        this.app.stage.addChild(this.backgroundContainer);
        this.backgroundGradient = GameView.createBackgroundGradient();
        this.backgroundContainer.addChild(this.backgroundGradient);

        this.mainContainer = new PIXI.Container();
        this.app.stage.addChild(this.mainContainer);
        this.scoreText = GameView.createScoreText();
        this.mainContainer.addChild(this.scoreText);

        this.resize();
        window.addEventListener('resize', this.resize.bind(this));

    }

    public updateScore(value: number) {
        this.scoreText.text = `Score: ${value}`;
    }

    public getApp(): PIXI.Application {
        return this.app;
    }

    private resize(): void {

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.mainContainer.position.set(this.width / 2, this.height / 2);

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
            GameView.gradient('#1A4A1C', '#308834')
        );

    }

    static createScoreText(): PIXI.Text {

        const scoreText = new PIXI.Text('Score: 0', {
            fontSize: 24,
            fill: 0xffffff
        });
        scoreText.anchor.set(0.5, 0.5);

        return scoreText;

    }

}

export default GameView;
